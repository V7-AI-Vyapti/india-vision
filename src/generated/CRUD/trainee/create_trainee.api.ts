import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Trainee } from '@entities/trainee.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTraineeRequestSchema = z.object({
    full_name: z.string(),
    father_name: z.string(),
    dob: z.number().int(),
    gender: z.string(),
    aadhaar: z.string(),
    mobile: z.string(),
    address: z.string(),
    bocw_reg_no: z.string(),
    bank_account: z.string(),
    ifsc: z.string(),
    experience_years: z.number().int(),
    source: z.string(),
    eligibility_status: z.string(),
    photo_url: z.string(),
    training_assignment_id: z.number().int().positive(),
    district_id: z.number().int().positive(),
    proposed_job_role_id: z.number().int().positive(),
    mobiliser_id: z.number().int().positive(),
});

export class CreateTraineeRequestDto extends createZodDto(
    CreateTraineeRequestSchema,
) {}

@Injectable()
export class CreateTraineeService {
    async create(body: CreateTraineeRequestDto) {
        const parsed = CreateTraineeRequestSchema.parse(body);
        return await Trainee.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTraineeController {
    constructor(private readonly service: CreateTraineeService) {}

    @RequirePermission('trainee', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/trainee',
        tags: ['trainee'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'trainee created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainee(
        @Body() body: CreateTraineeRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'trainee created',
        });
    }
}
