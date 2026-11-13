import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { BatchTrainee } from '@entities/batch_trainee.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateBatchTraineeRequestSchema = z.object({
    attendance_pct: z.number(),
    trainee_id: z.number().int().positive(),
    batch_id: z.number().int().positive(),
});

export class CreateBatchTraineeRequestDto extends createZodDto(
    CreateBatchTraineeRequestSchema,
) {}

@Injectable()
export class CreateBatchTraineeService {
    async create(body: CreateBatchTraineeRequestDto) {
        const parsed = CreateBatchTraineeRequestSchema.parse(body);
        return await BatchTrainee.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateBatchTraineeController {
    constructor(private readonly service: CreateBatchTraineeService) {}

    @RequirePermission('batch_trainee', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/batch_trainee',
        tags: ['batch_trainee'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'batch_trainee created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createBatchTrainee(
        @Body() body: CreateBatchTraineeRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'batch_trainee created',
        });
    }
}
