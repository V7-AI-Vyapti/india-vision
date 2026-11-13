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
export class DeleteTrainingCentreChecklistService {
    async remove(id: number) {
        const record = await TrainingCentreChecklist.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_centre_checklist not found');
        }
        await TrainingCentreChecklist.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteTrainingCentreChecklistController {
    constructor(
        private readonly service: DeleteTrainingCentreChecklistService,
    ) {}

    @RequirePermission('training_centre_checklist', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/training_centre_checklist/:id',
        tags: ['training_centre_checklist'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_centre_checklist deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]:
                'training_centre_checklist not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteTrainingCentreChecklist(
        @Param() params: TrainingCentreChecklistIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'training_centre_checklist deleted',
        });
    }
}
