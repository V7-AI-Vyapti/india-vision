import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { Staff } from '@entities/staff.entity';
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

export const ListStaffQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['staff_id', 'created_at', 'updated_at', 'full_name'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    home_district_id: z.coerce.number().int().positive().optional(),
});

export class ListStaffQueryDto extends createZodDto(ListStaffQuerySchema) {}

const LIST_STAFF_SORT_COLUMNS = {
    staff_id: 'staff_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    full_name: 'full_name',
} as const;

@Injectable()
export class ListStaffService {
    async list(query: ListStaffQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.full_name = ILike(`%${search}%`);
        }
        if (query.home_district_id != null) {
            where.home_district_id = query.home_district_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_STAFF_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            Staff.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            Staff.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListStaffController {
    constructor(private readonly service: ListStaffService) {}

    @RequirePermission('staff', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/staff',
        tags: ['staff'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'staff list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listStaff(
        @Query() query: ListStaffQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'staff list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
