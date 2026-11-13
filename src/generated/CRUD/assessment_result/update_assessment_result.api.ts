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
import { AssessmentResult } from '@entities/assessment_result.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateAssessmentResultRequestSchema = z
    .object({
        cert_status: z.string(),
        result: z.string(),
        score: z.number(),
        trainee_id: z.number().int().positive(),
        assessment_id: z.number().int().positive(),
    })
    .partial();

export class UpdateAssessmentResultRequestDto extends createZodDto(
    UpdateAssessmentResultRequestSchema,
) {}

export const AssessmentResultIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AssessmentResultIdParamsDto extends createZodDto(
    AssessmentResultIdParamsSchema,
) {}

@Injectable()
export class UpdateAssessmentResultService {
    async update(id: number, body: UpdateAssessmentResultRequestDto) {
        const record = await AssessmentResult.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assessment_result not found');
        }
        const parsed = UpdateAssessmentResultRequestSchema.parse(body);
        await AssessmentResult.updateByPk(id, parsed);
        return await AssessmentResult.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateAssessmentResultController {
    constructor(private readonly service: UpdateAssessmentResultService) {}

    @RequirePermission('assessment_result', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/assessment_result/:id',
        tags: ['assessment_result'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assessment_result updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assessment_result not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateAssessmentResult(
        @Param() params: AssessmentResultIdParamsDto,
        @Body() body: UpdateAssessmentResultRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'assessment_result updated',
        });
    }
}
