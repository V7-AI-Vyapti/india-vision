import {
    Body,
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

export const UpdateCertificateRequestSchema = z
    .object({
        certificate_no: z.string(),
        issued_at: z.number().int(),
        qr_url: z.string(),
        abc_uploaded: z.boolean(),
        trainee_id: z.number().int().positive(),
        assessment_id: z.number().int().positive(),
    })
    .partial();

export class UpdateCertificateRequestDto extends createZodDto(
    UpdateCertificateRequestSchema,
) {}

export const CertificateIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class CertificateIdParamsDto extends createZodDto(
    CertificateIdParamsSchema,
) {}

@Injectable()
export class UpdateCertificateService {
    async update(id: number, body: UpdateCertificateRequestDto) {
        const record = await Certificate.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('certificate not found');
        }
        const parsed = UpdateCertificateRequestSchema.parse(body);
        await Certificate.updateByPk(id, parsed);
        return await Certificate.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateCertificateController {
    constructor(private readonly service: UpdateCertificateService) {}

    @RequirePermission('certificate', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/certificate/:id',
        tags: ['certificate'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'certificate updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'certificate not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateCertificate(
        @Param() params: CertificateIdParamsDto,
        @Body() body: UpdateCertificateRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'certificate updated',
        });
    }
}
