import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateWageCompensationRequestSchema = z.object({
    days: z.number().int(),
    amount: z.number(),
    status: z.string(),
    dbt_reference: z.string(),
    received: z.boolean(),
    trainee_id: z.number().int().positive(),
    batch_id: z.number().int().positive(),
});

export class CreateWageCompensationRequestDto extends createZodDto(
    CreateWageCompensationRequestSchema,
) {}

@Injectable()
export class CreateWageCompensationService {
    async create(body: CreateWageCompensationRequestDto) {
        const parsed = CreateWageCompensationRequestSchema.parse(body);
        return await WageCompensation.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateWageCompensationController {
    constructor(private readonly service: CreateWageCompensationService) {}

    @RequirePermission('wage_compensation', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/wage_compensation',
        tags: ['wage_compensation'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'wage_compensation created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createWageCompensation(
        @Body() body: CreateWageCompensationRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'wage_compensation created',
        });
    }
}
