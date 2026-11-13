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
export class DeleteBatchTraineeService {
    async remove(id: number) {
        const record = await BatchTrainee.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('batch_trainee not found');
        }
        await BatchTrainee.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteBatchTraineeController {
    constructor(private readonly service: DeleteBatchTraineeService) {}

    @RequirePermission('batch_trainee', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/batch_trainee/:id',
        tags: ['batch_trainee'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'batch_trainee deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'batch_trainee not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteBatchTrainee(
        @Param() params: BatchTraineeIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'batch_trainee deleted',
        });
    }
}
