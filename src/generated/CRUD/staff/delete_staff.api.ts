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
import { Staff } from '@entities/staff.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const StaffIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class StaffIdParamsDto extends createZodDto(StaffIdParamsSchema) {}

@Injectable()
export class DeleteStaffService {
    async remove(id: number) {
        const record = await Staff.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('staff not found');
        }
        await Staff.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteStaffController {
    constructor(private readonly service: DeleteStaffService) {}

    @RequirePermission('staff', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/staff/:id',
        tags: ['staff'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'staff deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'staff not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteStaff(
        @Param() params: StaffIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'staff deleted',
        });
    }
}
