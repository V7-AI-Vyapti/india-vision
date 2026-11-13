import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TrainingCentreDocument } from '@entities/training_centre_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTrainingCentreDocumentRequestSchema = z.object({
    doc_type: z.string(),
    file_url: z.string(),
    training_centre_id: z.number().int().positive(),
});

export class CreateTrainingCentreDocumentRequestDto extends createZodDto(
    CreateTrainingCentreDocumentRequestSchema,
) {}

@Injectable()
export class CreateTrainingCentreDocumentService {
    async create(body: CreateTrainingCentreDocumentRequestDto) {
        const parsed = CreateTrainingCentreDocumentRequestSchema.parse(body);
        return await TrainingCentreDocument.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTrainingCentreDocumentController {
    constructor(
        private readonly service: CreateTrainingCentreDocumentService,
    ) {}

    @RequirePermission('training_centre_document', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/training_centre_document',
        tags: ['training_centre_document'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'training_centre_document created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTrainingCentreDocument(
        @Body() body: CreateTrainingCentreDocumentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'training_centre_document created',
        });
    }
}
