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
import { TrainingAssignment } from '@entities/training_assignment.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTrainingAssignmentRequestSchema = z
    .object({
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
    })
    .partial();

export class UpdateTrainingAssignmentRequestDto extends createZodDto(
    UpdateTrainingAssignmentRequestSchema,
) {}

export const TrainingAssignmentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingAssignmentIdParamsDto extends createZodDto(
    TrainingAssignmentIdParamsSchema,
) {}

@Injectable()
export class UpdateTrainingAssignmentService {
    async update(id: number, body: UpdateTrainingAssignmentRequestDto) {
        const record = await TrainingAssignment.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_assignment not found');
        }
        const parsed = UpdateTrainingAssignmentRequestSchema.parse(body);
        await TrainingAssignment.updateByPk(id, parsed);
        return await TrainingAssignment.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTrainingAssignmentController {
    constructor(private readonly service: UpdateTrainingAssignmentService) {}

    @RequirePermission('training_assignment', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/training_assignment/:id',
        tags: ['training_assignment'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_assignment updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_assignment not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainingAssignment(
        @Param() params: TrainingAssignmentIdParamsDto,
        @Body() body: UpdateTrainingAssignmentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'training_assignment updated',
        });
    }
}
