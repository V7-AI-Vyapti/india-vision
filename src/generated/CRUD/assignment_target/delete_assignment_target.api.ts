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
export class DeleteAssignmentTargetService {
    async remove(id: number) {
        const record = await AssignmentTarget.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assignment_target not found');
        }
        await AssignmentTarget.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteAssignmentTargetController {
    constructor(private readonly service: DeleteAssignmentTargetService) {}

    @RequirePermission('assignment_target', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/assignment_target/:id',
        tags: ['assignment_target'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assignment_target deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assignment_target not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteAssignmentTarget(
        @Param() params: AssignmentTargetIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'assignment_target deleted',
        });
    }
}
