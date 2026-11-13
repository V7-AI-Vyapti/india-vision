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
import { Assessment } from '@entities/assessment.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateAssessmentRequestSchema = z
    .object({
        status: z.string(),
        method: z.string(),
        assessment_date: z.number().int(),
        assessment_agency_id: z.number().int().positive(),
        batch_id: z.number().int().positive(),
    })
    .partial();

export class UpdateAssessmentRequestDto extends createZodDto(
    UpdateAssessmentRequestSchema,
) {}

export const AssessmentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AssessmentIdParamsDto extends createZodDto(
    AssessmentIdParamsSchema,
) {}

@Injectable()
export class UpdateAssessmentService {
    async update(id: number, body: UpdateAssessmentRequestDto) {
        const record = await Assessment.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assessment not found');
        }
        const parsed = UpdateAssessmentRequestSchema.parse(body);
        await Assessment.updateByPk(id, parsed);
        return await Assessment.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateAssessmentController {
    constructor(private readonly service: UpdateAssessmentService) {}

    @RequirePermission('assessment', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/assessment/:id',
        tags: ['assessment'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assessment updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assessment not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateAssessment(
        @Param() params: AssessmentIdParamsDto,
        @Body() body: UpdateAssessmentRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'assessment updated',
        });
    }
}
