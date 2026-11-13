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
import { Attendance } from '@entities/attendance.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateAttendanceRequestSchema = z
    .object({
        method: z.string(),
        status: z.string(),
        photo_url: z.string(),
        trainee_id: z.number().int().positive(),
        training_day_id: z.number().int().positive(),
    })
    .partial();

export class UpdateAttendanceRequestDto extends createZodDto(
    UpdateAttendanceRequestSchema,
) {}

export const AttendanceIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AttendanceIdParamsDto extends createZodDto(
    AttendanceIdParamsSchema,
) {}

@Injectable()
export class UpdateAttendanceService {
    async update(id: number, body: UpdateAttendanceRequestDto) {
        const record = await Attendance.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('attendance not found');
        }
        const parsed = UpdateAttendanceRequestSchema.parse(body);
        await Attendance.updateByPk(id, parsed);
        return await Attendance.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateAttendanceController {
    constructor(private readonly service: UpdateAttendanceService) {}

    @RequirePermission('attendance', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/attendance/:id',
        tags: ['attendance'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'attendance updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'attendance not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateAttendance(
        @Param() params: AttendanceIdParamsDto,
        @Body() body: UpdateAttendanceRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'attendance updated',
        });
    }
}
