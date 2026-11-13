import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { JobRole } from '@entities/job_role.entity';
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

export const ListJobRoleQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['job_role_id', 'created_at', 'updated_at', 'job_role_name'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
});

export class ListJobRoleQueryDto extends createZodDto(ListJobRoleQuerySchema) {}

const LIST_JOB_ROLE_SORT_COLUMNS = {
    job_role_id: 'job_role_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    job_role_name: 'job_role_name',
} as const;

@Injectable()
export class ListJobRoleService {
    async list(query: ListJobRoleQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.job_role_name = ILike(`%${search}%`);
        }
        const order = buildAllowedOrder({
            columns: LIST_JOB_ROLE_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            JobRole.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            JobRole.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListJobRoleController {
    constructor(private readonly service: ListJobRoleService) {}

    @RequirePermission('job_role', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/job_role',
        tags: ['job_role'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'job_role list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listJobRole(
        @Query() query: ListJobRoleQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'job_role list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
