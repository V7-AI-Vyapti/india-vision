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
import { TrainerDocument } from '@entities/trainer_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTrainerDocumentRequestSchema = z
    .object({
        doc_type: z.string(),
        file_url: z.string(),
        trainer_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTrainerDocumentRequestDto extends createZodDto(
    UpdateTrainerDocumentRequestSchema,
) {}

export const TrainerDocumentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainerDocumentIdParamsDto extends createZodDto(
    TrainerDocumentIdParamsSchema,
) {}

@Injectable()
export class UpdateTrainerDocumentService {
    async update(id: number, body: UpdateTrainerDocumentRequestDto) {
        const record = await TrainerDocument.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainer_document not found');
        }
        const parsed = UpdateTrainerDocumentRequestSchema.parse(body);
        await TrainerDocument.updateByPk(id, parsed);
        return await TrainerDocument.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTrainerDocumentController {
    constructor(private readonly service: UpdateTrainerDocumentService) {}

    @RequirePermission('trainer_document', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/trainer_document/:id',
        tags: ['trainer_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainer_document updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainer_document not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainerDocument(
        @Param() params: TrainerDocumentIdParamsDto,
        @Body() body: UpdateTrainerDocumentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'trainer_document updated',
        });
    }
}
