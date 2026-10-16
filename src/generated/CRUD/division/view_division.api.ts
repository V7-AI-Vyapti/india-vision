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
export class ViewDivisionService {
    async getById(id: number) {
        const record = await Division.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('division not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewDivisionController {
    constructor(private readonly service: ViewDivisionService) {}

    @RequirePermission('division', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/division/:id',
        tags: ['division'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'division fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'division not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getDivision(
        @Param() params: DivisionIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'division fetched',
        });
    }
}
