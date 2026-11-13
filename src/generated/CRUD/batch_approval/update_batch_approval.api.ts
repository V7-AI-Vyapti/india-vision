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
import { BatchApproval } from '@entities/batch_approval.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateBatchApprovalRequestSchema = z
    .object({
        submitted_at: z.number().int(),
        approved_at: z.number().int(),
        decision: z.string(),
        conditions: z.string(),
        batch_id: z.number().int().positive(),
        submitted_by_id: z.number().int().positive(),
    })
    .partial();

export class UpdateBatchApprovalRequestDto extends createZodDto(
    UpdateBatchApprovalRequestSchema,
) {}

export const BatchApprovalIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class BatchApprovalIdParamsDto extends createZodDto(
    BatchApprovalIdParamsSchema,
) {}

@Injectable()
export class UpdateBatchApprovalService {
    async update(id: number, body: UpdateBatchApprovalRequestDto) {
        const record = await BatchApproval.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('batch_approval not found');
        }
        const parsed = UpdateBatchApprovalRequestSchema.parse(body);
        await BatchApproval.updateByPk(id, parsed);
        return await BatchApproval.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateBatchApprovalController {
    constructor(private readonly service: UpdateBatchApprovalService) {}

    @RequirePermission('batch_approval', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/batch_approval/:id',
        tags: ['batch_approval'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch_approval updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'batch_approval not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateBatchApproval(
        @Param() params: BatchApprovalIdParamsDto,
        @Body() body: UpdateBatchApprovalRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'batch_approval updated',
        });
    }
}
