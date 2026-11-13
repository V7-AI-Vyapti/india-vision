import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { TraineeDocument } from '@entities/trainee_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateTraineeDocumentRequestSchema = z.object({
    doc_type: z.string(),
    file_url: z.string(),
    trainee_id: z.number().int().positive(),
});

export class CreateTraineeDocumentRequestDto extends createZodDto(
    CreateTraineeDocumentRequestSchema,
) {}

@Injectable()
export class CreateTraineeDocumentService {
    async create(body: CreateTraineeDocumentRequestDto) {
        const parsed = CreateTraineeDocumentRequestSchema.parse(body);
        return await TraineeDocument.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTraineeDocumentController {
    constructor(private readonly service: CreateTraineeDocumentService) {}

    @RequirePermission('trainee_document', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/trainee_document',
        tags: ['trainee_document'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'trainee_document created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTraineeDocument(
        @Body() body: CreateTraineeDocumentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'trainee_document created',
        });
    }
}
