import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateLoiRequestSchema = z.object({
    loi_date: z.number().int(),
    source: z.string(),
    poc_name: z.string(),
    poc_designation: z.string(),
    poc_mobile: z.string(),
    poc_email: z.string(),
    file_url: z.string(),
    training_assignment_id: z.number().int().positive(),
    district_id: z.number().int().positive(),
});

export class CreateLoiRequestDto extends createZodDto(CreateLoiRequestSchema) {}

@Injectable()
export class CreateLoiService {
    async create(body: CreateLoiRequestDto) {
        const parsed = CreateLoiRequestSchema.parse(body);
        return await Loi.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateLoiController {
    constructor(private readonly service: CreateLoiService) {}

    @RequirePermission('loi', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/loi',
        tags: ['loi'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'loi created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createLoi(
        @Body() body: CreateLoiRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'loi created',
        });
    }
}
