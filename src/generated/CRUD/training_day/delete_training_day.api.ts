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
import { TrainingDay } from '@entities/training_day.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TrainingDayIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingDayIdParamsDto extends createZodDto(
    TrainingDayIdParamsSchema,
) {}

@Injectable()
export class DeleteTrainingDayService {
    async remove(id: number) {
        const record = await TrainingDay.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_day not found');
        }
        await TrainingDay.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteTrainingDayController {
    constructor(private readonly service: DeleteTrainingDayService) {}

    @RequirePermission('training_day', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/training_day/:id',
        tags: ['training_day'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_day deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_day not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteTrainingDay(
        @Param() params: TrainingDayIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'training_day deleted',
        });
    }
}
