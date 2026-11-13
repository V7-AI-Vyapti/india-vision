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
import { PreScreening } from '@entities/pre_screening.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdatePreScreeningRequestSchema = z
    .object({
        competencies_demonstrated: z.string(),
        competencies_gap: z.string(),
        outcome: z.string(),
        screened_on: z.number().int(),
        trainee_id: z.number().int().positive(),
        job_role_id: z.number().int().positive(),
        screened_by_id: z.number().int().positive(),
    })
    .partial();

export class UpdatePreScreeningRequestDto extends createZodDto(
    UpdatePreScreeningRequestSchema,
) {}

export const PreScreeningIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class PreScreeningIdParamsDto extends createZodDto(
    PreScreeningIdParamsSchema,
) {}

@Injectable()
export class UpdatePreScreeningService {
    async update(id: number, body: UpdatePreScreeningRequestDto) {
        const record = await PreScreening.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('pre_screening not found');
        }
        const parsed = UpdatePreScreeningRequestSchema.parse(body);
        await PreScreening.updateByPk(id, parsed);
        return await PreScreening.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdatePreScreeningController {
    constructor(private readonly service: UpdatePreScreeningService) {}

    @RequirePermission('pre_screening', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/pre_screening/:id',
        tags: ['pre_screening'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'pre_screening updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'pre_screening not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updatePreScreening(
        @Param() params: PreScreeningIdParamsDto,
        @Body() body: UpdatePreScreeningRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'pre_screening updated',
        });
    }
}
