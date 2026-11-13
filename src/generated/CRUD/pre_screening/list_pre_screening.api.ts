import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { PreScreening } from '@entities/pre_screening.entity';
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

export const ListPreScreeningQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum([
            'pre_screening_id',
            'created_at',
            'updated_at',
            'competencies_demonstrated',
        ])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    trainee_id: z.coerce.number().int().positive().optional(),
    job_role_id: z.coerce.number().int().positive().optional(),
    screened_by_id: z.coerce.number().int().positive().optional(),
});

export class ListPreScreeningQueryDto extends createZodDto(
    ListPreScreeningQuerySchema,
) {}

const LIST_PRE_SCREENING_SORT_COLUMNS = {
    pre_screening_id: 'pre_screening_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    competencies_demonstrated: 'competencies_demonstrated',
} as const;

@Injectable()
export class ListPreScreeningService {
    async list(query: ListPreScreeningQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.competencies_demonstrated = ILike(`%${search}%`);
        }
        if (query.trainee_id != null) {
            where.trainee_id = query.trainee_id;
        }
        if (query.job_role_id != null) {
            where.job_role_id = query.job_role_id;
        }
        if (query.screened_by_id != null) {
            where.screened_by_id = query.screened_by_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_PRE_SCREENING_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            PreScreening.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            PreScreening.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListPreScreeningController {
    constructor(private readonly service: ListPreScreeningService) {}

    @RequirePermission('pre_screening', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/pre_screening',
        tags: ['pre_screening'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'pre_screening list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listPreScreening(
        @Query() query: ListPreScreeningQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'pre_screening list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
