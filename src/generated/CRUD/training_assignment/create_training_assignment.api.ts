import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TrainingAssignment } from '@entities/training_assignment.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainingAssignmentRequestSchema = z.object({
    assignment_name: z.string(),
    no_of_trainees: z.number().int(),
    start_date: z.number().int(),
    end_date: z.number().int(),
    batch_min_size: z.number().int(),
    batch_max_size: z.number().int(),
    rpl_guidelines: z.string(),
    status: z.string(),
    client_id: z.number().int().positive(),
    welfare_board_id: z.number().int().positive(),
    assessment_agency_id: z.number().int().positive(),
    state_id: z.number().int().positive(),
});

export class CreateTrainingAssignmentRequestDto extends createZodDto(
    CreateTrainingAssignmentRequestSchema,
) {}

@Injectable()
export class CreateTrainingAssignmentService {
    async create(body: CreateTrainingAssignmentRequestDto) {
        const parsed = CreateTrainingAssignmentRequestSchema.parse(body);
        return await TrainingAssignment.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainingAssignmentController {
    constructor(private readonly service: CreateTrainingAssignmentService) {}

    @RequirePermission('training_assignment', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/training_assignment',
        tags: ['training_assignment'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'training_assignment created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainingAssignment(
        @Body() body: CreateTrainingAssignmentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'training_assignment created',
        });
    }
}
