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
import { Division } from '@entities/division.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const DivisionIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class DivisionIdParamsDto extends createZodDto(DivisionIdParamsSchema) {}

@Injectable()
export class DeleteDivisionService {
    async remove(id: number) {
        const record = await Division.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('division not found');
        }
        await Division.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteDivisionController {
    constructor(private readonly service: DeleteDivisionService) {}

    @RequirePermission('division', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/division/:id',
        tags: ['division'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'division deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'division not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteDivision(
        @Param() params: DivisionIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'division deleted',
        });
    }
}
