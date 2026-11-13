import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Attendance } from '@entities/attendance.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateAttendanceRequestSchema = z.object({
    method: z.string(),
    status: z.string(),
    photo_url: z.string(),
    trainee_id: z.number().int().positive(),
    training_day_id: z.number().int().positive(),
});

export class CreateAttendanceRequestDto extends createZodDto(
    CreateAttendanceRequestSchema,
) {}

@Injectable()
export class CreateAttendanceService {
    async create(body: CreateAttendanceRequestDto) {
        const parsed = CreateAttendanceRequestSchema.parse(body);
        return await Attendance.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateAttendanceController {
    constructor(private readonly service: CreateAttendanceService) {}

    @RequirePermission('attendance', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/attendance',
        tags: ['attendance'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'attendance created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createAttendance(
        @Body() body: CreateAttendanceRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'attendance created',
        });
    }
}
