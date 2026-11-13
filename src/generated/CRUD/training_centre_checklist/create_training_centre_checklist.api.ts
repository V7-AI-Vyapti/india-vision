import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TrainingCentreChecklist } from '@entities/training_centre_checklist.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainingCentreChecklistRequestSchema = z.object({
    item_name: z.string(),
    training_centre_id: z.number().int().positive(),
    verified: z.boolean(),
    is_available: z.boolean(),
});

export class CreateTrainingCentreChecklistRequestDto extends createZodDto(
    CreateTrainingCentreChecklistRequestSchema,
) {}

@Injectable()
export class CreateTrainingCentreChecklistService {
    async create(body: CreateTrainingCentreChecklistRequestDto) {
        const parsed = CreateTrainingCentreChecklistRequestSchema.parse(body);
        return await TrainingCentreChecklist.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainingCentreChecklistController {
    constructor(
        private readonly service: CreateTrainingCentreChecklistService,
    ) {}

    @RequirePermission('training_centre_checklist', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/training_centre_checklist',
        tags: ['training_centre_checklist'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'training_centre_checklist created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainingCentreChecklist(
        @Body() body: CreateTrainingCentreChecklistRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'training_centre_checklist created',
        });
    }
}
