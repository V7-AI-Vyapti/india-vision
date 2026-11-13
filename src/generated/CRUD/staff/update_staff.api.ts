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
import { Staff } from '@entities/staff.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateStaffRequestSchema = z
    .object({
        base_role: z.string(),
        email: z.string(),
        mobile: z.string(),
        full_name: z.string(),
        home_district_id: z.number().int().positive(),
    })
    .partial();

export class UpdateStaffRequestDto extends createZodDto(
    UpdateStaffRequestSchema,
) {}

export const StaffIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class StaffIdParamsDto extends createZodDto(StaffIdParamsSchema) {}

@Injectable()
export class UpdateStaffService {
    async update(id: number, body: UpdateStaffRequestDto) {
        const record = await Staff.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('staff not found');
        }
        const parsed = UpdateStaffRequestSchema.parse(body);
        await Staff.updateByPk(id, parsed);
        return await Staff.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateStaffController {
    constructor(private readonly service: UpdateStaffService) {}

    @RequirePermission('staff', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/staff/:id',
        tags: ['staff'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'staff updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'staff not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateStaff(
        @Param() params: StaffIdParamsDto,
        @Body() body: UpdateStaffRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'staff updated',
        });
    }
}
