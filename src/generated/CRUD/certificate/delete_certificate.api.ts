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
export class DeleteCertificateService {
    async remove(id: number) {
        const record = await Certificate.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('certificate not found');
        }
        await Certificate.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteCertificateController {
    constructor(private readonly service: DeleteCertificateService) {}

    @RequirePermission('certificate', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/certificate/:id',
        tags: ['certificate'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'certificate deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'certificate not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteCertificate(
        @Param() params: CertificateIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'certificate deleted',
        });
    }
}
