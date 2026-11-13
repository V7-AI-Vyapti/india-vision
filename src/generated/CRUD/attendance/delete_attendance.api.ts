import {
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

export const AttendanceIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AttendanceIdParamsDto extends createZodDto(
    AttendanceIdParamsSchema,
) {}

@Injectable()
export class DeleteAttendanceService {
    async remove(id: number) {
        const record = await Attendance.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('attendance not found');
        }
        await Attendance.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteAttendanceController {
    constructor(private readonly service: DeleteAttendanceService) {}

    @RequirePermission('attendance', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/attendance/:id',
        tags: ['attendance'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'attendance deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'attendance not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteAttendance(
        @Param() params: AttendanceIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'attendance deleted',
        });
    }
}
