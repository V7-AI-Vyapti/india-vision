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
export class DeleteCurriculumService {
    async remove(id: number) {
        const record = await Curriculum.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('curriculum not found');
        }
        await Curriculum.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteCurriculumController {
    constructor(private readonly service: DeleteCurriculumService) {}

    @RequirePermission('curriculum', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/curriculum/:id',
        tags: ['curriculum'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'curriculum deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'curriculum not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteCurriculum(
        @Param() params: CurriculumIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'curriculum deleted',
        });
    }
}
