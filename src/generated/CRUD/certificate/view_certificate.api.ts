import {
    Controller,
    Injectable,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Certificate } from '@entities/certificate.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CertificateIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class CertificateIdParamsDto extends createZodDto(
    CertificateIdParamsSchema,
) {}

@Injectable()
export class ViewCertificateService {
    async getById(id: number) {
        const record = await Certificate.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('certificate not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewCertificateController {
    constructor(private readonly service: ViewCertificateService) {}

    @RequirePermission('certificate', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/certificate/:id',
        tags: ['certificate'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'certificate fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'certificate not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getCertificate(
        @Param() params: CertificateIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'certificate fetched',
        });
    }
}
