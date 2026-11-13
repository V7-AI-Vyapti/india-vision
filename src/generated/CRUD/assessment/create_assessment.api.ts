import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { Assessment } from '@entities/assessment.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateAssessmentRequestSchema = z.object({
    status: z.string(),
    method: z.string(),
    assessment_date: z.number().int(),
    assessment_agency_id: z.number().int().positive(),
    batch_id: z.number().int().positive(),
});

export class CreateAssessmentRequestDto extends createZodDto(
    CreateAssessmentRequestSchema,
) {}

@Injectable()
export class CreateAssessmentService {
    async create(body: CreateAssessmentRequestDto) {
        const parsed = CreateAssessmentRequestSchema.parse(body);
        return await Assessment.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateAssessmentController {
    constructor(private readonly service: CreateAssessmentService) {}

    @RequirePermission('assessment', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/assessment',
        tags: ['assessment'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'assessment created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createAssessment(
        @Body() body: CreateAssessmentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'assessment created',
        });
    }
}
