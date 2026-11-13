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
import { Division } from '@entities/division.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateDivisionRequestSchema = z
    .object({
        division_name: z.string(),
        state_id: z.number().int().positive(),
        is_active: z.boolean(),
    })
    .partial();

export class UpdateDivisionRequestDto extends createZodDto(
    UpdateDivisionRequestSchema,
) {}

export const DivisionIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class DivisionIdParamsDto extends createZodDto(DivisionIdParamsSchema) {}

@Injectable()
export class UpdateDivisionService {
    async update(id: number, body: UpdateDivisionRequestDto) {
        const record = await Division.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('division not found');
        }
        const parsed = UpdateDivisionRequestSchema.parse(body);
        await Division.updateByPk(id, parsed);
        return await Division.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateDivisionController {
    constructor(private readonly service: UpdateDivisionService) {}

    @RequirePermission('division', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/division/:id',
        tags: ['division'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'division updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'division not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateDivision(
        @Param() params: DivisionIdParamsDto,
        @Body() body: UpdateDivisionRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'division updated',
        });
    }
}
