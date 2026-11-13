import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateAssignmentTargetRequestSchema = z.object({
    target_count: z.number().int(),
    job_role_id: z.number().int().positive(),
    district_id: z.number().int().positive(),
    training_assignment_id: z.number().int().positive(),
});

export class CreateAssignmentTargetRequestDto extends createZodDto(
    CreateAssignmentTargetRequestSchema,
) {}

@Injectable()
export class CreateAssignmentTargetService {
    async create(body: CreateAssignmentTargetRequestDto) {
        const parsed = CreateAssignmentTargetRequestSchema.parse(body);
        return await AssignmentTarget.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateAssignmentTargetController {
    constructor(private readonly service: CreateAssignmentTargetService) {}

    @RequirePermission('assignment_target', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/assignment_target',
        tags: ['assignment_target'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'assignment_target created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createAssignmentTarget(
        @Body() body: CreateAssignmentTargetRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'assignment_target created',
        });
    }
}
