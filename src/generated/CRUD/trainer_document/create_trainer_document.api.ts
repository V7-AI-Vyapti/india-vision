import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TrainerDocument } from '@entities/trainer_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainerDocumentRequestSchema = z.object({
    doc_type: z.string(),
    file_url: z.string(),
    trainer_id: z.number().int().positive(),
});

export class CreateTrainerDocumentRequestDto extends createZodDto(
    CreateTrainerDocumentRequestSchema,
) {}

@Injectable()
export class CreateTrainerDocumentService {
    async create(body: CreateTrainerDocumentRequestDto) {
        const parsed = CreateTrainerDocumentRequestSchema.parse(body);
        return await TrainerDocument.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainerDocumentController {
    constructor(private readonly service: CreateTrainerDocumentService) {}

    @RequirePermission('trainer_document', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/trainer_document',
        tags: ['trainer_document'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'trainer_document created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainerDocument(
        @Body() body: CreateTrainerDocumentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'trainer_document created',
        });
    }
}
