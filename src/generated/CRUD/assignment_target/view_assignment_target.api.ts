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
import { AssignmentTarget } from '@entities/assignment_target.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const AssignmentTargetIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AssignmentTargetIdParamsDto extends createZodDto(
    AssignmentTargetIdParamsSchema,
) {}

@Injectable()
export class ViewAssignmentTargetService {
    async getById(id: number) {
        const record = await AssignmentTarget.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assignment_target not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewAssignmentTargetController {
    constructor(private readonly service: ViewAssignmentTargetService) {}

    @RequirePermission('assignment_target', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/assignment_target/:id',
        tags: ['assignment_target'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assignment_target fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assignment_target not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getAssignmentTarget(
        @Param() params: AssignmentTargetIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'assignment_target fetched',
        });
    }
}
