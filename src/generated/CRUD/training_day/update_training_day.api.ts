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
import { TrainingDay } from '@entities/training_day.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTrainingDayRequestSchema = z
    .object({
        training_date: z.number().int(),
        topic: z.string(),
        planned_hours: z.number().int(),
        actual_hours: z.number().int(),
        present_count: z.number().int(),
        remarks: z.string(),
        batch_id: z.number().int().positive(),
        trainer_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTrainingDayRequestDto extends createZodDto(
    UpdateTrainingDayRequestSchema,
) {}

export const TrainingDayIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingDayIdParamsDto extends createZodDto(
    TrainingDayIdParamsSchema,
) {}

@Injectable()
export class UpdateTrainingDayService {
    async update(id: number, body: UpdateTrainingDayRequestDto) {
        const record = await TrainingDay.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_day not found');
        }
        const parsed = UpdateTrainingDayRequestSchema.parse(body);
        await TrainingDay.updateByPk(id, parsed);
        return await TrainingDay.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTrainingDayController {
    constructor(private readonly service: UpdateTrainingDayService) {}

    @RequirePermission('training_day', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/training_day/:id',
        tags: ['training_day'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_day updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_day not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainingDay(
        @Param() params: TrainingDayIdParamsDto,
        @Body() body: UpdateTrainingDayRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'training_day updated',
        });
    }
}
