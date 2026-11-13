import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { Trainee } from '@entities/trainee.entity';
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

export const ListTraineeQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['trainee_id', 'created_at', 'updated_at', 'full_name'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    training_assignment_id: z.coerce.number().int().positive().optional(),
    district_id: z.coerce.number().int().positive().optional(),
    proposed_job_role_id: z.coerce.number().int().positive().optional(),
    mobiliser_id: z.coerce.number().int().positive().optional(),
});

export class ListTraineeQueryDto extends createZodDto(ListTraineeQuerySchema) {}

const LIST_TRAINEE_SORT_COLUMNS = {
    trainee_id: 'trainee_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    full_name: 'full_name',
} as const;

@Injectable()
export class ListTraineeService {
    async list(query: ListTraineeQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.full_name = ILike(`%${search}%`);
        }
        if (query.training_assignment_id != null) {
            where.training_assignment_id = query.training_assignment_id;
        }
        if (query.district_id != null) {
            where.district_id = query.district_id;
        }
        if (query.proposed_job_role_id != null) {
            where.proposed_job_role_id = query.proposed_job_role_id;
        }
        if (query.mobiliser_id != null) {
            where.mobiliser_id = query.mobiliser_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_TRAINEE_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            Trainee.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            Trainee.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListTraineeController {
    constructor(private readonly service: ListTraineeService) {}

    @RequirePermission('trainee', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/trainee',
        tags: ['trainee'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainee list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listTrainee(
        @Query() query: ListTraineeQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'trainee list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
