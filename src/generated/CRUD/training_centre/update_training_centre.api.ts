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
import { TrainingCentre } from '@entities/training_centre.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTrainingCentreRequestSchema = z
    .object({
        centre_name: z.string(),
        address: z.string(),
        gps_lat: z.number(),
        gps_long: z.number(),
        centre_type: z.string(),
        status: z.string(),
        district_id: z.number().int().positive(),
        training_assignment_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTrainingCentreRequestDto extends createZodDto(
    UpdateTrainingCentreRequestSchema,
) {}

export const TrainingCentreIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainingCentreIdParamsDto extends createZodDto(
    TrainingCentreIdParamsSchema,
) {}

@Injectable()
export class UpdateTrainingCentreService {
    async update(id: number, body: UpdateTrainingCentreRequestDto) {
        const record = await TrainingCentre.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('training_centre not found');
        }
        const parsed = UpdateTrainingCentreRequestSchema.parse(body);
        await TrainingCentre.updateByPk(id, parsed);
        return await TrainingCentre.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTrainingCentreController {
    constructor(private readonly service: UpdateTrainingCentreService) {}

    @RequirePermission('training_centre', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/training_centre/:id',
        tags: ['training_centre'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'training_centre updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'training_centre not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainingCentre(
        @Param() params: TrainingCentreIdParamsDto,
        @Body() body: UpdateTrainingCentreRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'training_centre updated',
        });
    }
}
