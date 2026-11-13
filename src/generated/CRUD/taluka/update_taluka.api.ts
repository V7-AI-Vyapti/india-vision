import {
    Body,
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

export const UpdateTalukaRequestSchema = z
    .object({
        taluka_name: z.string(),
        district_id: z.number().int().positive(),
        is_active: z.boolean(),
    })
    .partial();

export class UpdateTalukaRequestDto extends createZodDto(
    UpdateTalukaRequestSchema,
) {}

export const TalukaIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TalukaIdParamsDto extends createZodDto(TalukaIdParamsSchema) {}

@Injectable()
export class UpdateTalukaService {
    async update(id: number, body: UpdateTalukaRequestDto) {
        const record = await Taluka.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('taluka not found');
        }
        const parsed = UpdateTalukaRequestSchema.parse(body);
        await Taluka.updateByPk(id, parsed);
        return await Taluka.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTalukaController {
    constructor(private readonly service: UpdateTalukaService) {}

    @RequirePermission('taluka', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/taluka/:id',
        tags: ['taluka'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'taluka updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'taluka not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTaluka(
        @Param() params: TalukaIdParamsDto,
        @Body() body: UpdateTalukaRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'taluka updated',
        });
    }
}
