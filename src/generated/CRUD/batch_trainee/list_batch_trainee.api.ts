import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { BatchTrainee } from '@entities/batch_trainee.entity';
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

export const ListBatchTraineeQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['batch_trainee_id', 'created_at', 'updated_at'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    trainee_id: z.coerce.number().int().positive().optional(),
    batch_id: z.coerce.number().int().positive().optional(),
});

export class ListBatchTraineeQueryDto extends createZodDto(
    ListBatchTraineeQuerySchema,
) {}

const LIST_BATCH_TRAINEE_SORT_COLUMNS = {
    batch_trainee_id: 'batch_trainee_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
} as const;

@Injectable()
export class ListBatchTraineeService {
    async list(query: ListBatchTraineeQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (query.trainee_id != null) {
            where.trainee_id = query.trainee_id;
        }
        if (query.batch_id != null) {
            where.batch_id = query.batch_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_BATCH_TRAINEE_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            BatchTrainee.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            BatchTrainee.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListBatchTraineeController {
    constructor(private readonly service: ListBatchTraineeService) {}

    @RequirePermission('batch_trainee', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/batch_trainee',
        tags: ['batch_trainee'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch_trainee list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listBatchTrainee(
        @Query() query: ListBatchTraineeQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'batch_trainee list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
