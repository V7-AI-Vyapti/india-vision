import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Curriculum } from '@entities/curriculum.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateCurriculumRequestSchema = z.object({
    title: z.string(),
    duration_days: z.number().int(),
    total_hours: z.number().int(),
    job_role_id: z.number().int().positive(),
});

export class CreateCurriculumRequestDto extends createZodDto(
    CreateCurriculumRequestSchema,
) {}

@Injectable()
export class CreateCurriculumService {
    async create(body: CreateCurriculumRequestDto) {
        const parsed = CreateCurriculumRequestSchema.parse(body);
        return await Curriculum.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateCurriculumController {
    constructor(private readonly service: CreateCurriculumService) {}

    @RequirePermission('curriculum', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/curriculum',
        tags: ['curriculum'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'curriculum created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createCurriculum(
        @Body() body: CreateCurriculumRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'curriculum created',
        });
    }
}
