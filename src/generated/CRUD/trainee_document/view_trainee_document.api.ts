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
import { TraineeDocument } from '@entities/trainee_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TraineeDocumentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TraineeDocumentIdParamsDto extends createZodDto(
    TraineeDocumentIdParamsSchema,
) {}

@Injectable()
export class ViewTraineeDocumentService {
    async getById(id: number) {
        const record = await TraineeDocument.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainee_document not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTraineeDocumentController {
    constructor(private readonly service: ViewTraineeDocumentService) {}

    @RequirePermission('trainee_document', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/trainee_document/:id',
        tags: ['trainee_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainee_document fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainee_document not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTraineeDocument(
        @Param() params: TraineeDocumentIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'trainee_document fetched',
        });
    }
}
