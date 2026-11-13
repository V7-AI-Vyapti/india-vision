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
import { BatchApproval } from '@entities/batch_approval.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const BatchApprovalIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class BatchApprovalIdParamsDto extends createZodDto(
    BatchApprovalIdParamsSchema,
) {}

@Injectable()
export class DeleteBatchApprovalService {
    async remove(id: number) {
        const record = await BatchApproval.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('batch_approval not found');
        }
        await BatchApproval.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteBatchApprovalController {
    constructor(private readonly service: DeleteBatchApprovalService) {}

    @RequirePermission('batch_approval', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/batch_approval/:id',
        tags: ['batch_approval'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch_approval deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'batch_approval not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteBatchApproval(
        @Param() params: BatchApprovalIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'batch_approval deleted',
        });
    }
}
