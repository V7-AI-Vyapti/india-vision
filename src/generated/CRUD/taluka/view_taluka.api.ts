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
import { Taluka } from '@entities/taluka.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TalukaIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TalukaIdParamsDto extends createZodDto(TalukaIdParamsSchema) {}

@Injectable()
export class ViewTalukaService {
    async getById(id: number) {
        const record = await Taluka.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('taluka not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTalukaController {
    constructor(private readonly service: ViewTalukaService) {}

    @RequirePermission('taluka', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/taluka/:id',
        tags: ['taluka'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'taluka fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'taluka not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTaluka(
        @Param() params: TalukaIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'taluka fetched',
        });
    }
}
