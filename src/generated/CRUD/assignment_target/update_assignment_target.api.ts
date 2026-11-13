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
import { AssignmentTarget } from '@entities/assignment_target.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateAssignmentTargetRequestSchema = z
    .object({
        target_count: z.number().int(),
        job_role_id: z.number().int().positive(),
        district_id: z.number().int().positive(),
        training_assignment_id: z.number().int().positive(),
    })
    .partial();

export class UpdateAssignmentTargetRequestDto extends createZodDto(
    UpdateAssignmentTargetRequestSchema,
) {}

export const AssignmentTargetIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AssignmentTargetIdParamsDto extends createZodDto(
    AssignmentTargetIdParamsSchema,
) {}

@Injectable()
export class UpdateAssignmentTargetService {
    async update(id: number, body: UpdateAssignmentTargetRequestDto) {
        const record = await AssignmentTarget.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assignment_target not found');
        }
        const parsed = UpdateAssignmentTargetRequestSchema.parse(body);
        await AssignmentTarget.updateByPk(id, parsed);
        return await AssignmentTarget.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateAssignmentTargetController {
    constructor(private readonly service: UpdateAssignmentTargetService) {}

    @RequirePermission('assignment_target', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/assignment_target/:id',
        tags: ['assignment_target'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assignment_target updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assignment_target not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateAssignmentTarget(
        @Param() params: AssignmentTargetIdParamsDto,
        @Body() body: UpdateAssignmentTargetRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'assignment_target updated',
        });
    }
}
