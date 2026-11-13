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
import { Loi } from '@entities/loi.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateLoiRequestSchema = z
    .object({
        loi_date: z.number().int(),
        source: z.string(),
        poc_name: z.string(),
        poc_designation: z.string(),
        poc_mobile: z.string(),
        poc_email: z.string(),
        file_url: z.string(),
        training_assignment_id: z.number().int().positive(),
        district_id: z.number().int().positive(),
    })
    .partial();

export class UpdateLoiRequestDto extends createZodDto(UpdateLoiRequestSchema) {}

export const LoiIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class LoiIdParamsDto extends createZodDto(LoiIdParamsSchema) {}

@Injectable()
export class UpdateLoiService {
    async update(id: number, body: UpdateLoiRequestDto) {
        const record = await Loi.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('loi not found');
        }
        const parsed = UpdateLoiRequestSchema.parse(body);
        await Loi.updateByPk(id, parsed);
        return await Loi.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateLoiController {
    constructor(private readonly service: UpdateLoiService) {}

    @RequirePermission('loi', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/loi/:id',
        tags: ['loi'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'loi updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'loi not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateLoi(
        @Param() params: LoiIdParamsDto,
        @Body() body: UpdateLoiRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'loi updated',
        });
    }
}
