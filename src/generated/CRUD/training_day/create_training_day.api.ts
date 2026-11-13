import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TrainingDay } from '@entities/training_day.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainingDayRequestSchema = z.object({
    training_date: z.number().int(),
    topic: z.string(),
    planned_hours: z.number().int(),
    actual_hours: z.number().int(),
    present_count: z.number().int(),
    remarks: z.string(),
    batch_id: z.number().int().positive(),
    trainer_id: z.number().int().positive(),
});

export class CreateTrainingDayRequestDto extends createZodDto(
    CreateTrainingDayRequestSchema,
) {}

@Injectable()
export class CreateTrainingDayService {
    async create(body: CreateTrainingDayRequestDto) {
        const parsed = CreateTrainingDayRequestSchema.parse(body);
        return await TrainingDay.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainingDayController {
    constructor(private readonly service: CreateTrainingDayService) {}

    @RequirePermission('training_day', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/training_day',
        tags: ['training_day'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'training_day created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainingDay(
        @Body() body: CreateTrainingDayRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'training_day created',
        });
    }
}
