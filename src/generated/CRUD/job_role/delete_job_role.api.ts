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
import { JobRole } from '@entities/job_role.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const JobRoleIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class JobRoleIdParamsDto extends createZodDto(JobRoleIdParamsSchema) {}

@Injectable()
export class DeleteJobRoleService {
    async remove(id: number) {
        const record = await JobRole.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('job_role not found');
        }
        await JobRole.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteJobRoleController {
    constructor(private readonly service: DeleteJobRoleService) {}

    @RequirePermission('job_role', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/job_role/:id',
        tags: ['job_role'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'job_role deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'job_role not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteJobRole(
        @Param() params: JobRoleIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'job_role deleted',
        });
    }
}
