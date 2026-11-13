import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { AssignmentTarget } from '@entities/assignment_target.entity';
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

export const ListAssignmentTargetQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['assignment_target_id', 'created_at', 'updated_at'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    job_role_id: z.coerce.number().int().positive().optional(),
    district_id: z.coerce.number().int().positive().optional(),
    training_assignment_id: z.coerce.number().int().positive().optional(),
});

export class ListAssignmentTargetQueryDto extends createZodDto(
    ListAssignmentTargetQuerySchema,
) {}

const LIST_ASSIGNMENT_TARGET_SORT_COLUMNS = {
    assignment_target_id: 'assignment_target_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
} as const;

@Injectable()
export class ListAssignmentTargetService {
    async list(query: ListAssignmentTargetQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (query.job_role_id != null) {
            where.job_role_id = query.job_role_id;
        }
        if (query.district_id != null) {
            where.district_id = query.district_id;
        }
        if (query.training_assignment_id != null) {
            where.training_assignment_id = query.training_assignment_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_ASSIGNMENT_TARGET_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            AssignmentTarget.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            AssignmentTarget.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListAssignmentTargetController {
    constructor(private readonly service: ListAssignmentTargetService) {}

    @RequirePermission('assignment_target', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/assignment_target',
        tags: ['assignment_target'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assignment_target list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listAssignmentTarget(
        @Query() query: ListAssignmentTargetQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'assignment_target list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
