import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateBatchApprovalRequestSchema = z.object({
    submitted_at: z.number().int(),
    approved_at: z.number().int(),
    decision: z.string(),
    conditions: z.string(),
    batch_id: z.number().int().positive(),
    submitted_by_id: z.number().int().positive(),
});

export class CreateBatchApprovalRequestDto extends createZodDto(
    CreateBatchApprovalRequestSchema,
) {}

@Injectable()
export class CreateBatchApprovalService {
    async create(body: CreateBatchApprovalRequestDto) {
        const parsed = CreateBatchApprovalRequestSchema.parse(body);
        return await BatchApproval.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateBatchApprovalController {
    constructor(private readonly service: CreateBatchApprovalService) {}

    @RequirePermission('batch_approval', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/batch_approval',
        tags: ['batch_approval'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'batch_approval created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createBatchApproval(
        @Body() body: CreateBatchApprovalRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'batch_approval created',
        });
    }
}
