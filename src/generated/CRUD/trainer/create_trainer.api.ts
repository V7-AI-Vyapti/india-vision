import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Trainer } from '@entities/trainer.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainerRequestSchema = z.object({
    aadhaar: z.string(),
    pan: z.string(),
    sidh_id: z.string(),
    tot_cert_no: z.string(),
    tot_valid_till: z.number().int(),
    experience_years: z.number().int(),
    is_deployable: z.boolean(),
    feedback_rating: z.number(),
    staff_id: z.number().int().positive(),
    primary_job_role_id: z.number().int().positive(),
});

export class CreateTrainerRequestDto extends createZodDto(
    CreateTrainerRequestSchema,
) {}

@Injectable()
export class CreateTrainerService {
    async create(body: CreateTrainerRequestDto) {
        const parsed = CreateTrainerRequestSchema.parse(body);
        return await Trainer.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainerController {
    constructor(private readonly service: CreateTrainerService) {}

    @RequirePermission('trainer', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/trainer',
        tags: ['trainer'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'trainer created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainer(
        @Body() body: CreateTrainerRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'trainer created',
        });
    }
}
