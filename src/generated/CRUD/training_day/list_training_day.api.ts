import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { TrainingDay } from '@entities/training_day.entity';
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

export const ListTrainingDayQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['training_day_id', 'created_at', 'updated_at', 'topic'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    batch_id: z.coerce.number().int().positive().optional(),
    trainer_id: z.coerce.number().int().positive().optional(),
});

export class ListTrainingDayQueryDto extends createZodDto(
    ListTrainingDayQuerySchema,
) {}

const LIST_TRAINING_DAY_SORT_COLUMNS = {
    training_day_id: 'training_day_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    topic: 'topic',
} as const;

@Injectable()
export class ListTrainingDayService {
    async list(query: ListTrainingDayQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.topic = ILike(`%${search}%`);
        }
        if (query.batch_id != null) {
            where.batch_id = query.batch_id;
        }
        if (query.trainer_id != null) {
            where.trainer_id = query.trainer_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_TRAINING_DAY_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            TrainingDay.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            TrainingDay.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListTrainingDayController {
    constructor(private readonly service: ListTrainingDayService) {}

    @RequirePermission('training_day', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/training_day',
        tags: ['training_day'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_day list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listTrainingDay(
        @Query() query: ListTrainingDayQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'training_day list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
