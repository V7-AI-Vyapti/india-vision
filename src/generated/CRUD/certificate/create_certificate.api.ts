import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateCertificateRequestSchema = z.object({
    certificate_no: z.string(),
    issued_at: z.number().int(),
    qr_url: z.string(),
    abc_uploaded: z.boolean(),
    trainee_id: z.number().int().positive(),
    assessment_id: z.number().int().positive(),
});

export class CreateCertificateRequestDto extends createZodDto(
    CreateCertificateRequestSchema,
) {}

@Injectable()
export class CreateCertificateService {
    async create(body: CreateCertificateRequestDto) {
        const parsed = CreateCertificateRequestSchema.parse(body);
        return await Certificate.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateCertificateController {
    constructor(private readonly service: CreateCertificateService) {}

    @RequirePermission('certificate', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/certificate',
        tags: ['certificate'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'certificate created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createCertificate(
        @Body() body: CreateCertificateRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'certificate created',
        });
    }
}
