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
import { TrainingCentreDocument } from '@entities/training_centre_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTrainingCentreDocumentRequestSchema = z
    .object({
        doc_type: z.string(),
        file_url: z.string(),
        training_centre_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTrainingCentreDocumentRequestDto extends createZodDto(
    UpdateTrainingCentreDocumentRequestSchema,
) {}

export const TrainingCentreDocumentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingCentreDocumentIdParamsDto extends createZodDto(
    TrainingCentreDocumentIdParamsSchema,
) {}

@Injectable()
export class UpdateTrainingCentreDocumentService {
    async update(id: number, body: UpdateTrainingCentreDocumentRequestDto) {
        const record = await TrainingCentreDocument.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_centre_document not found');
        }
        const parsed = UpdateTrainingCentreDocumentRequestSchema.parse(body);
        await TrainingCentreDocument.updateByPk(id, parsed);
        return await TrainingCentreDocument.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTrainingCentreDocumentController {
    constructor(
        private readonly service: UpdateTrainingCentreDocumentService,
    ) {}

    @RequirePermission('training_centre_document', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/training_centre_document/:id',
        tags: ['training_centre_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_centre_document updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_centre_document not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainingCentreDocument(
        @Param() params: TrainingCentreDocumentIdParamsDto,
        @Body() body: UpdateTrainingCentreDocumentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'training_centre_document updated',
        });
    }
}
