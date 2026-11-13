import {
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

export const TrainingAssignmentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingAssignmentIdParamsDto extends createZodDto(
    TrainingAssignmentIdParamsSchema,
) {}

@Injectable()
export class ViewTrainingAssignmentService {
    async getById(id: number) {
        const record = await TrainingAssignment.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_assignment not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTrainingAssignmentController {
    constructor(private readonly service: ViewTrainingAssignmentService) {}

    @RequirePermission('training_assignment', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/training_assignment/:id',
        tags: ['training_assignment'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_assignment fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_assignment not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTrainingAssignment(
        @Param() params: TrainingAssignmentIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'training_assignment fetched',
        });
    }
}
