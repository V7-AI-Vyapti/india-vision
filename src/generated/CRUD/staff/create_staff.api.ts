import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Staff } from '@entities/staff.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateStaffRequestSchema = z.object({
    base_role: z.string(),
    email: z.string(),
    mobile: z.string(),
    full_name: z.string(),
    home_district_id: z.number().int().positive(),
});

export class CreateStaffRequestDto extends createZodDto(
    CreateStaffRequestSchema,
) {}

@Injectable()
export class CreateStaffService {
    async create(body: CreateStaffRequestDto) {
        const parsed = CreateStaffRequestSchema.parse(body);
        return await Staff.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateStaffController {
    constructor(private readonly service: CreateStaffService) {}

    @RequirePermission('staff', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/staff',
        tags: ['staff'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'staff created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createStaff(
        @Body() body: CreateStaffRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'staff created',
        });
    }
}
