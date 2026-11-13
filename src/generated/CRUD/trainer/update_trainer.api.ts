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
import { Trainer } from '@entities/trainer.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTrainerRequestSchema = z
    .object({
        aadhaar: z.string(),
        pan: z.string(),
        sidh_id: z.string(),
        tot_cert_no: z.string(),
        tot_valid_till: z.number().int(),
        experience_years: z.number().int(),
        is_deployable: z.boolean(),
        feedback_rating: z.number(),
        staff_id: z.number().int().positive(),
        primary_job_role_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTrainerRequestDto extends createZodDto(
    UpdateTrainerRequestSchema,
) {}

export const TrainerIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainerIdParamsDto extends createZodDto(TrainerIdParamsSchema) {}

@Injectable()
export class UpdateTrainerService {
    async update(id: number, body: UpdateTrainerRequestDto) {
        const record = await Trainer.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainer not found');
        }
        const parsed = UpdateTrainerRequestSchema.parse(body);
        await Trainer.updateByPk(id, parsed);
        return await Trainer.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTrainerController {
    constructor(private readonly service: UpdateTrainerService) {}

    @RequirePermission('trainer', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/trainer/:id',
        tags: ['trainer'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainer updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainer not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainer(
        @Param() params: TrainerIdParamsDto,
        @Body() body: UpdateTrainerRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'trainer updated',
        });
    }
}
