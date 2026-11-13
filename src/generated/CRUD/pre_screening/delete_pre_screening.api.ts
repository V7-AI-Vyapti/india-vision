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
import { PreScreening } from '@entities/pre_screening.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const PreScreeningIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class PreScreeningIdParamsDto extends createZodDto(
    PreScreeningIdParamsSchema,
) {}

@Injectable()
export class DeletePreScreeningService {
    async remove(id: number) {
        const record = await PreScreening.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('pre_screening not found');
        }
        await PreScreening.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeletePreScreeningController {
    constructor(private readonly service: DeletePreScreeningService) {}

    @RequirePermission('pre_screening', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/pre_screening/:id',
        tags: ['pre_screening'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'pre_screening deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'pre_screening not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deletePreScreening(
        @Param() params: PreScreeningIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'pre_screening deleted',
        });
    }
}
