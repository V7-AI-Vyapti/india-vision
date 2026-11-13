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
import { TrainingCentreChecklist } from '@entities/training_centre_checklist.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TrainingCentreChecklistIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingCentreChecklistIdParamsDto extends createZodDto(
    TrainingCentreChecklistIdParamsSchema,
) {}

@Injectable()
export class ViewTrainingCentreChecklistService {
    async getById(id: number) {
        const record = await TrainingCentreChecklist.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_centre_checklist not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTrainingCentreChecklistController {
    constructor(private readonly service: ViewTrainingCentreChecklistService) {}

    @RequirePermission('training_centre_checklist', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/training_centre_checklist/:id',
        tags: ['training_centre_checklist'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_centre_checklist fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]:
                'training_centre_checklist not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTrainingCentreChecklist(
        @Param() params: TrainingCentreChecklistIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'training_centre_checklist fetched',
        });
    }
}
