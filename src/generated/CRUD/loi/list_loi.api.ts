import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { Loi } from '@entities/loi.entity';
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

export const ListLoiQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['loi_id', 'created_at', 'updated_at', 'poc_name'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    training_assignment_id: z.coerce.number().int().positive().optional(),
    district_id: z.coerce.number().int().positive().optional(),
});

export class ListLoiQueryDto extends createZodDto(ListLoiQuerySchema) {}

const LIST_LOI_SORT_COLUMNS = {
    loi_id: 'loi_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    poc_name: 'poc_name',
} as const;

@Injectable()
export class ListLoiService {
    async list(query: ListLoiQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.poc_name = ILike(`%${search}%`);
        }
        if (query.training_assignment_id != null) {
            where.training_assignment_id = query.training_assignment_id;
        }
        if (query.district_id != null) {
            where.district_id = query.district_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_LOI_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            Loi.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            Loi.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListLoiController {
    constructor(private readonly service: ListLoiService) {}

    @RequirePermission('loi', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/loi',
        tags: ['loi'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'loi list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listLoi(
        @Query() query: ListLoiQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'loi list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
