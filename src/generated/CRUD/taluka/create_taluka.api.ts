import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateTalukaRequestSchema = z.object({
    taluka_name: z.string(),
    district_id: z.number().int().positive(),
    is_active: z.boolean(),
});

export class CreateTalukaRequestDto extends createZodDto(
    CreateTalukaRequestSchema,
) {}

@Injectable()
export class CreateTalukaService {
    async create(body: CreateTalukaRequestDto) {
        const parsed = CreateTalukaRequestSchema.parse(body);
        return await Taluka.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTalukaController {
    constructor(private readonly service: CreateTalukaService) {}

    @RequirePermission('taluka', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/taluka',
        tags: ['taluka'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'taluka created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTaluka(
        @Body() body: CreateTalukaRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'taluka created',
        });
    }
}
