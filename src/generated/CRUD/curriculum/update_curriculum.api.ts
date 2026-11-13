import {
    Body,
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

export const UpdateCurriculumRequestSchema = z
    .object({
        title: z.string(),
        duration_days: z.number().int(),
        total_hours: z.number().int(),
        job_role_id: z.number().int().positive(),
    })
    .partial();

export class UpdateCurriculumRequestDto extends createZodDto(
    UpdateCurriculumRequestSchema,
) {}

export const CurriculumIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class CurriculumIdParamsDto extends createZodDto(
    CurriculumIdParamsSchema,
) {}

@Injectable()
export class UpdateCurriculumService {
    async update(id: number, body: UpdateCurriculumRequestDto) {
        const record = await Curriculum.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('curriculum not found');
        }
        const parsed = UpdateCurriculumRequestSchema.parse(body);
        await Curriculum.updateByPk(id, parsed);
        return await Curriculum.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateCurriculumController {
    constructor(private readonly service: UpdateCurriculumService) {}

    @RequirePermission('curriculum', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/curriculum/:id',
        tags: ['curriculum'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'curriculum updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'curriculum not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateCurriculum(
        @Param() params: CurriculumIdParamsDto,
        @Body() body: UpdateCurriculumRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'curriculum updated',
        });
    }
}
