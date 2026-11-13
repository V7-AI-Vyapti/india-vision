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
import { TraineeDocument } from '@entities/trainee_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTraineeDocumentRequestSchema = z
    .object({
        doc_type: z.string(),
        file_url: z.string(),
        trainee_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTraineeDocumentRequestDto extends createZodDto(
    UpdateTraineeDocumentRequestSchema,
) {}

export const TraineeDocumentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TraineeDocumentIdParamsDto extends createZodDto(
    TraineeDocumentIdParamsSchema,
) {}

@Injectable()
export class UpdateTraineeDocumentService {
    async update(id: number, body: UpdateTraineeDocumentRequestDto) {
        const record = await TraineeDocument.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainee_document not found');
        }
        const parsed = UpdateTraineeDocumentRequestSchema.parse(body);
        await TraineeDocument.updateByPk(id, parsed);
        return await TraineeDocument.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTraineeDocumentController {
    constructor(private readonly service: UpdateTraineeDocumentService) {}

    @RequirePermission('trainee_document', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/trainee_document/:id',
        tags: ['trainee_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainee_document updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainee_document not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTraineeDocument(
        @Param() params: TraineeDocumentIdParamsDto,
        @Body() body: UpdateTraineeDocumentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'trainee_document updated',
        });
    }
}
