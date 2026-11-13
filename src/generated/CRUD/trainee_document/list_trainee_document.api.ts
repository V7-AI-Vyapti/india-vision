import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { TraineeDocument } from '@entities/trainee_document.entity';
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

export const ListTraineeDocumentQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['trainee_document_id', 'created_at', 'updated_at', 'doc_type'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    trainee_id: z.coerce.number().int().positive().optional(),
});

export class ListTraineeDocumentQueryDto extends createZodDto(
    ListTraineeDocumentQuerySchema,
) {}

const LIST_TRAINEE_DOCUMENT_SORT_COLUMNS = {
    trainee_document_id: 'trainee_document_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    doc_type: 'doc_type',
} as const;

@Injectable()
export class ListTraineeDocumentService {
    async list(query: ListTraineeDocumentQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.doc_type = ILike(`%${search}%`);
        }
        if (query.trainee_id != null) {
            where.trainee_id = query.trainee_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_TRAINEE_DOCUMENT_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            TraineeDocument.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            TraineeDocument.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListTraineeDocumentController {
    constructor(private readonly service: ListTraineeDocumentService) {}

    @RequirePermission('trainee_document', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/trainee_document',
        tags: ['trainee_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainee_document list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listTraineeDocument(
        @Query() query: ListTraineeDocumentQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'trainee_document list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
