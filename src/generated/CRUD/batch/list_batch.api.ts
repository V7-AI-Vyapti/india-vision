import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { Batch } from '@entities/batch.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ILike, IsNull } from 'typeorm';
import {
    buildAllowedOrder,
    normalizeSearch,
    resolvePagination,
} from '@vulcan/shared/utils/list-query';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const ListBatchQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['batch_id', 'created_at', 'updated_at', 'batch_code'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    training_assignment_id: z.coerce.number().int().positive().optional(),
    job_role_id: z.coerce.number().int().positive().optional(),
    training_centre_id: z.coerce.number().int().positive().optional(),
    trainer_id: z.coerce.number().int().positive().optional(),
});

export class ListBatchQueryDto extends createZodDto(ListBatchQuerySchema) {}

const LIST_BATCH_SORT_COLUMNS = {
    batch_id: 'batch_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    batch_code: 'batch_code',
} as const;

@Injectable()
export class ListBatchService {
    async list(query: ListBatchQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.batch_code = ILike(`%${search}%`);
        }
        if (query.training_assignment_id != null) {
            where.training_assignment_id = query.training_assignment_id;
        }
        if (query.job_role_id != null) {
            where.job_role_id = query.job_role_id;
        }
        if (query.training_centre_id != null) {
            where.training_centre_id = query.training_centre_id;
        }
        if (query.trainer_id != null) {
            where.trainer_id = query.trainer_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_BATCH_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            Batch.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            Batch.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListBatchController {
    constructor(private readonly service: ListBatchService) {}

    @RequirePermission('batch', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/batch',
        tags: ['batch'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listBatch(
        @Query() query: ListBatchQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'batch list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
