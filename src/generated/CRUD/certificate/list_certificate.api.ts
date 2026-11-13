import { Controller, Injectable, Query } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
    buildPaginationMeta,
} from '@vyapti/core/custom_api_response';
import { Certificate } from '@entities/certificate.entity';
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

export const ListCertificateQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional().nullable(),
    sortBy: z
        .enum(['certificate_id', 'created_at', 'updated_at', 'certificate_no'])
        .default('created_at'),
    sortOrder: z.preprocess(
        (value) => (typeof value === 'string' ? value.toUpperCase() : value),
        z.enum(['ASC', 'DESC']).default('DESC'),
    ),
    trainee_id: z.coerce.number().int().positive().optional(),
    assessment_id: z.coerce.number().int().positive().optional(),
});

export class ListCertificateQueryDto extends createZodDto(
    ListCertificateQuerySchema,
) {}

const LIST_CERTIFICATE_SORT_COLUMNS = {
    certificate_id: 'certificate_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    certificate_no: 'certificate_no',
} as const;

@Injectable()
export class ListCertificateService {
    async list(query: ListCertificateQueryDto) {
        const pagination = resolvePagination(query);
        const search = normalizeSearch(query.search);
        const where: Record<string, unknown> = {
            deleted_at: IsNull(),
        };
        if (search) {
            where.certificate_no = ILike(`%${search}%`);
        }
        if (query.trainee_id != null) {
            where.trainee_id = query.trainee_id;
        }
        if (query.assessment_id != null) {
            where.assessment_id = query.assessment_id;
        }
        const order = buildAllowedOrder({
            columns: LIST_CERTIFICATE_SORT_COLUMNS,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
            defaultSortBy: 'created_at',
            defaultSortOrder: 'DESC',
        });
        const [rows, total] = await Promise.all([
            Certificate.filter(where, {
                order,
                skip: pagination.skip,
                take: pagination.take,
            }),
            Certificate.countOf(where),
        ]);
        return { items: rows, total, pagination };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ListCertificateController {
    constructor(private readonly service: ListCertificateService) {}

    @RequirePermission('certificate', 'list')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/certificate',
        tags: ['certificate'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'certificate list fetched',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async listCertificate(
        @Query() query: ListCertificateQueryDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const { items, total, pagination } = await this.service.list(query);
        return apiSuccess(items, {
            message: 'certificate list fetched',
            meta: buildPaginationMeta(pagination.page, pagination.limit, total),
        });
    }
}
