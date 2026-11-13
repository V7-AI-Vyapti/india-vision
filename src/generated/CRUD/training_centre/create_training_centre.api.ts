import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TrainingCentre } from '@entities/training_centre.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainingCentreRequestSchema = z.object({
    centre_name: z.string(),
    address: z.string(),
    gps_lat: z.number(),
    gps_long: z.number(),
    centre_type: z.string(),
    status: z.string(),
    district_id: z.number().int().positive(),
    training_assignment_id: z.number().int().positive(),
});

export class CreateTrainingCentreRequestDto extends createZodDto(
    CreateTrainingCentreRequestSchema,
) {}

@Injectable()
export class CreateTrainingCentreService {
    async create(body: CreateTrainingCentreRequestDto) {
        const parsed = CreateTrainingCentreRequestSchema.parse(body);
        return await TrainingCentre.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainingCentreController {
    constructor(private readonly service: CreateTrainingCentreService) {}

    @RequirePermission('training_centre', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/training_centre',
        tags: ['training_centre'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'training_centre created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainingCentre(
        @Body() body: CreateTrainingCentreRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'training_centre created',
        });
    }
}
