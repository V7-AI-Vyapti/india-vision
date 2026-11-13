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
import { WageCompensation } from '@entities/wage_compensation.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateWageCompensationRequestSchema = z
    .object({
        days: z.number().int(),
        amount: z.number(),
        status: z.string(),
        dbt_reference: z.string(),
        received: z.boolean(),
        trainee_id: z.number().int().positive(),
        batch_id: z.number().int().positive(),
    })
    .partial();

export class UpdateWageCompensationRequestDto extends createZodDto(
    UpdateWageCompensationRequestSchema,
) {}

export const WageCompensationIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class WageCompensationIdParamsDto extends createZodDto(
    WageCompensationIdParamsSchema,
) {}

@Injectable()
export class UpdateWageCompensationService {
    async update(id: number, body: UpdateWageCompensationRequestDto) {
        const record = await WageCompensation.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('wage_compensation not found');
        }
        const parsed = UpdateWageCompensationRequestSchema.parse(body);
        await WageCompensation.updateByPk(id, parsed);
        return await WageCompensation.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateWageCompensationController {
    constructor(private readonly service: UpdateWageCompensationService) {}

    @RequirePermission('wage_compensation', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/wage_compensation/:id',
        tags: ['wage_compensation'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'wage_compensation updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'wage_compensation not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateWageCompensation(
        @Param() params: WageCompensationIdParamsDto,
        @Body() body: UpdateWageCompensationRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'wage_compensation updated',
        });
    }
}
