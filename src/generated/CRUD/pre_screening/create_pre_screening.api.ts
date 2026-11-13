import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreatePreScreeningRequestSchema = z.object({
    competencies_demonstrated: z.string(),
    competencies_gap: z.string(),
    outcome: z.string(),
    screened_on: z.number().int(),
    trainee_id: z.number().int().positive(),
    job_role_id: z.number().int().positive(),
    screened_by_id: z.number().int().positive(),
});

export class CreatePreScreeningRequestDto extends createZodDto(
    CreatePreScreeningRequestSchema,
) {}

@Injectable()
export class CreatePreScreeningService {
    async create(body: CreatePreScreeningRequestDto) {
        const parsed = CreatePreScreeningRequestSchema.parse(body);
        return await PreScreening.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreatePreScreeningController {
    constructor(private readonly service: CreatePreScreeningService) {}

    @RequirePermission('pre_screening', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/pre_screening',
        tags: ['pre_screening'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'pre_screening created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createPreScreening(
        @Body() body: CreatePreScreeningRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'pre_screening created',
        });
    }
}
