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
import { BatchTrainee } from '@entities/batch_trainee.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const BatchTraineeIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class BatchTraineeIdParamsDto extends createZodDto(
    BatchTraineeIdParamsSchema,
) {}

@Injectable()
export class ViewBatchTraineeService {
    async getById(id: number) {
        const record = await BatchTrainee.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('batch_trainee not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewBatchTraineeController {
    constructor(private readonly service: ViewBatchTraineeService) {}

    @RequirePermission('batch_trainee', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/batch_trainee/:id',
        tags: ['batch_trainee'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch_trainee fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'batch_trainee not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getBatchTrainee(
        @Param() params: BatchTraineeIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'batch_trainee fetched',
        });
    }
}
