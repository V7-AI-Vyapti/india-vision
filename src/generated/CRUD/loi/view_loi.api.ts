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
import { Loi } from '@entities/loi.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const LoiIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class LoiIdParamsDto extends createZodDto(LoiIdParamsSchema) {}

@Injectable()
export class ViewLoiService {
    async getById(id: number) {
        const record = await Loi.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('loi not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewLoiController {
    constructor(private readonly service: ViewLoiService) {}

    @RequirePermission('loi', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/loi/:id',
        tags: ['loi'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'loi fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'loi not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getLoi(
        @Param() params: LoiIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'loi fetched',
        });
    }
}
