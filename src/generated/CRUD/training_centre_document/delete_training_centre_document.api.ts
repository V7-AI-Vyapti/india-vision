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
import { TrainingCentreDocument } from '@entities/training_centre_document.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TrainingCentreDocumentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingCentreDocumentIdParamsDto extends createZodDto(
    TrainingCentreDocumentIdParamsSchema,
) {}

@Injectable()
export class DeleteTrainingCentreDocumentService {
    async remove(id: number) {
        const record = await TrainingCentreDocument.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_centre_document not found');
        }
        await TrainingCentreDocument.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteTrainingCentreDocumentController {
    constructor(
        private readonly service: DeleteTrainingCentreDocumentService,
    ) {}

    @RequirePermission('training_centre_document', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/training_centre_document/:id',
        tags: ['training_centre_document'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_centre_document deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_centre_document not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteTrainingCentreDocument(
        @Param() params: TrainingCentreDocumentIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'training_centre_document deleted',
        });
    }
}
