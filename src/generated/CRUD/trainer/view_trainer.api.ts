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
import { Trainer } from '@entities/trainer.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TrainerIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TrainerIdParamsDto extends createZodDto(TrainerIdParamsSchema) {}

@Injectable()
export class ViewTrainerService {
    async getById(id: number) {
        const record = await Trainer.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainer not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTrainerController {
    constructor(private readonly service: ViewTrainerService) {}

    @RequirePermission('trainer', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/trainer/:id',
        tags: ['trainer'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainer fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainer not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTrainer(
        @Param() params: TrainerIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'trainer fetched',
        });
    }
}
