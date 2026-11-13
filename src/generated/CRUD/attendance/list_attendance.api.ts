import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { Attendance } from '@entities/attendance.entity';
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

export const ListAttendanceQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['attendance_id', 'created_at', 'updated_at', 'method'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    trainee_id: z.coerce.number().int().positive().optional(),
    training_day_id: z.coerce.number().int().positive().optional(),
});

export class ListAttendanceQueryDto extends createZodDto(
    ListAttendanceQuerySchema,
) {}

const LIST_ATTENDANCE_SORT_COLUMNS = {
    attendance_id: 'attendance_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    method: 'method',
} as const;

@Injectable()
export class ListAttendanceService {
    async list(query: ListAttendanceQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.method = ILike(`%${search}%`);
        }
        if (query.trainee_id != null) {
            where.trainee_id = query.trainee_id;
        }
        if (query.training_day_id != null) {
            where.training_day_id = query.training_day_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_ATTENDANCE_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            Attendance.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            Attendance.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListAttendanceController {
    constructor(private readonly service: ListAttendanceService) {}

    @RequirePermission('attendance', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/attendance',
        tags: ['attendance'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'attendance list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listAttendance(
        @Query() query: ListAttendanceQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'attendance list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
