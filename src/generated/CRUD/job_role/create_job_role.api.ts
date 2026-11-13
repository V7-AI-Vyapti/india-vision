import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { JobRole } from '@entities/job_role.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateJobRoleRequestSchema = z.object({
    job_role_name: z.string(),
    nsqf_level: z.string(),
    sector: z.string(),
    awarding_body: z.string(),
    notional_hours: z.number().int(),
    credits: z.number(),
    qp_nos_code: z.string(),
    valid_till: z.number().int(),
});

export class CreateJobRoleRequestDto extends createZodDto(
    CreateJobRoleRequestSchema,
) {}

@Injectable()
export class CreateJobRoleService {
    async create(body: CreateJobRoleRequestDto) {
        const parsed = CreateJobRoleRequestSchema.parse(body);
        return await JobRole.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateJobRoleController {
    constructor(private readonly service: CreateJobRoleService) {}

    @RequirePermission('job_role', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/job_role',
        tags: ['job_role'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'job_role created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createJobRole(
        @Body() body: CreateJobRoleRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'job_role created',
        });
    }
}
