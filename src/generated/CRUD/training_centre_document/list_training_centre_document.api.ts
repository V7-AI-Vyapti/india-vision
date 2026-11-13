import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { TrainingCentreDocument } from '@entities/training_centre_document.entity';
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

export const ListTrainingCentreDocumentQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum([
            'training_centre_document_id',
            'created_at',
            'updated_at',
            'doc_type',
        ])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    training_centre_id: z.coerce.number().int().positive().optional(),
});

export class ListTrainingCentreDocumentQueryDto extends createZodDto(
    ListTrainingCentreDocumentQuerySchema,
) {}

const LIST_TRAINING_CENTRE_DOCUMENT_SORT_COLUMNS = {
    training_centre_document_id: 'training_centre_document_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    doc_type: 'doc_type',
} as const;

@Injectable()
export class ListTrainingCentreDocumentService {
    async list(query: ListTrainingCentreDocumentQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.doc_type = ILike(`%${search}%`);
        }
        if (query.training_centre_id != null) {
            where.training_centre_id = query.training_centre_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_TRAINING_CENTRE_DOCUMENT_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            TrainingCentreDocument.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            TrainingCentreDocument.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListTrainingCentreDocumentController {
    constructor(private readonly service: ListTrainingCentreDocumentService) {}

    @RequirePermission('training_centre_document', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/training_centre_document',
        tags: ['training_centre_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_centre_document list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listTrainingCentreDocument(
        @Query() query: ListTrainingCentreDocumentQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'training_centre_document list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
