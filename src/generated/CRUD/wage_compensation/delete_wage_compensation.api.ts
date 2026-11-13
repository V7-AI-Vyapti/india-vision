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
import { WageCompensation } from '@entities/wage_compensation.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const WageCompensationIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class WageCompensationIdParamsDto extends createZodDto(
    WageCompensationIdParamsSchema,
) {}

@Injectable()
export class DeleteWageCompensationService {
    async remove(id: number) {
        const record = await WageCompensation.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('wage_compensation not found');
        }
        await WageCompensation.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteWageCompensationController {
    constructor(private readonly service: DeleteWageCompensationService) {}

    @RequirePermission('wage_compensation', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/wage_compensation/:id',
        tags: ['wage_compensation'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'wage_compensation deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'wage_compensation not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteWageCompensation(
        @Param() params: WageCompensationIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'wage_compensation deleted',
        });
    }
}
