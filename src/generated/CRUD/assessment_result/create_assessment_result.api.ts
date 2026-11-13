import { Body, Controller, Injectable } from '@nestjs/common';
import { buildEndpoint } from '@vyapti/core/custom_api';
import {
    apiSuccess,
    type ApiSuccessResponse,
} from '@vyapti/core/custom_api_response';
import { AssessmentResult } from '@entities/assessment_result.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const CreateAssessmentResultRequestSchema = z.object({
    cert_status: z.string(),
    result: z.string(),
    score: z.number(),
    trainee_id: z.number().int().positive(),
    assessment_id: z.number().int().positive(),
});

export class CreateAssessmentResultRequestDto extends createZodDto(
    CreateAssessmentResultRequestSchema,
) {}

@Injectable()
export class CreateAssessmentResultService {
    async create(body: CreateAssessmentResultRequestDto) {
        const parsed = CreateAssessmentResultRequestSchema.parse(body);
        return await AssessmentResult.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateAssessmentResultController {
    constructor(private readonly service: CreateAssessmentResultService) {}

    @RequirePermission('assessment_result', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/assessment_result',
        tags: ['assessment_result'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'assessment_result created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createAssessmentResult(
        @Body() body: CreateAssessmentResultRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'assessment_result created',
        });
    }
}
