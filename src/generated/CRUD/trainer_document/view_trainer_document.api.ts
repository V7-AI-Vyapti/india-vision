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
import { TrainerDocument } from '@entities/trainer_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TrainerDocumentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainerDocumentIdParamsDto extends createZodDto(
    TrainerDocumentIdParamsSchema,
) {}

@Injectable()
export class ViewTrainerDocumentService {
    async getById(id: number) {
        const record = await TrainerDocument.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainer_document not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTrainerDocumentController {
    constructor(private readonly service: ViewTrainerDocumentService) {}

    @RequirePermission('trainer_document', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/trainer_document/:id',
        tags: ['trainer_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainer_document fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainer_document not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTrainerDocument(
        @Param() params: TrainerDocumentIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'trainer_document fetched',
        });
    }
}
