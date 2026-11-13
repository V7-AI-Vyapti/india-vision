import {
    Controller,
    Injectable,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Curriculum } from '@entities/curriculum.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CurriculumIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class CurriculumIdParamsDto extends createZodDto(
    CurriculumIdParamsSchema,
) {}

@Injectable()
export class ViewCurriculumService {
    async getById(id: number) {
        const record = await Curriculum.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('curriculum not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewCurriculumController {
    constructor(private readonly service: ViewCurriculumService) {}

    @RequirePermission('curriculum', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/curriculum/:id',
        tags: ['curriculum'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'curriculum fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'curriculum not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getCurriculum(
        @Param() params: CurriculumIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'curriculum fetched',
        });
    }
}
