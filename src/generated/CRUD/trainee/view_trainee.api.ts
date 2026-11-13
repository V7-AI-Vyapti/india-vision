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
import { Trainee } from '@entities/trainee.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TraineeIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TraineeIdParamsDto extends createZodDto(TraineeIdParamsSchema) {}

@Injectable()
export class ViewTraineeService {
    async getById(id: number) {
        const record = await Trainee.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainee not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTraineeController {
    constructor(private readonly service: ViewTraineeService) {}

    @RequirePermission('trainee', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/trainee/:id',
        tags: ['trainee'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainee fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainee not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTrainee(
        @Param() params: TraineeIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'trainee fetched',
        });
    }
}
