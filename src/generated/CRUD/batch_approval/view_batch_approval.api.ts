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
export class ViewBatchApprovalService {
    async getById(id: number) {
        const record = await BatchApproval.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('batch_approval not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewBatchApprovalController {
    constructor(private readonly service: ViewBatchApprovalService) {}

    @RequirePermission('batch_approval', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/batch_approval/:id',
        tags: ['batch_approval'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch_approval fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'batch_approval not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getBatchApproval(
        @Param() params: BatchApprovalIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'batch_approval fetched',
        });
    }
}
