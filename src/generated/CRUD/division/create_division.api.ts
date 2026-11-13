import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateDivisionRequestSchema = z.object({
    division_name: z.string(),
    state_id: z.number().int().positive(),
    is_active: z.boolean(),
});

export class CreateDivisionRequestDto extends createZodDto(
    CreateDivisionRequestSchema,
) {}

@Injectable()
export class CreateDivisionService {
    async create(body: CreateDivisionRequestDto) {
        const parsed = CreateDivisionRequestSchema.parse(body);
        return await Division.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateDivisionController {
    constructor(private readonly service: CreateDivisionService) {}

    @RequirePermission('division', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/division',
        tags: ['division'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'division created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createDivision(
        @Body() body: CreateDivisionRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'division created',
        });
    }
}
