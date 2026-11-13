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
import { JobRole } from '@entities/job_role.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateJobRoleRequestSchema = z
    .object({
        job_role_name: z.string(),
        nsqf_level: z.string(),
        sector: z.string(),
        awarding_body: z.string(),
        notional_hours: z.number().int(),
        credits: z.number(),
        qp_nos_code: z.string(),
        valid_till: z.number().int(),
    })
    .partial();

export class UpdateJobRoleRequestDto extends createZodDto(
    UpdateJobRoleRequestSchema,
) {}

export const JobRoleIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class JobRoleIdParamsDto extends createZodDto(JobRoleIdParamsSchema) {}

@Injectable()
export class UpdateJobRoleService {
    async update(id: number, body: UpdateJobRoleRequestDto) {
        const record = await JobRole.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('job_role not found');
        }
        const parsed = UpdateJobRoleRequestSchema.parse(body);
        await JobRole.updateByPk(id, parsed);
        return await JobRole.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateJobRoleController {
    constructor(private readonly service: UpdateJobRoleService) {}

    @RequirePermission('job_role', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/job_role/:id',
        tags: ['job_role'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'job_role updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'job_role not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateJobRole(
        @Param() params: JobRoleIdParamsDto,
        @Body() body: UpdateJobRoleRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'job_role updated',
        });
    }
}
