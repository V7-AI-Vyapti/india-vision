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
import { AssessmentResult } from '@entities/assessment_result.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const AssessmentResultIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AssessmentResultIdParamsDto extends createZodDto(
    AssessmentResultIdParamsSchema,
) {}

@Injectable()
export class ViewAssessmentResultService {
    async getById(id: number) {
        const record = await AssessmentResult.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assessment_result not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewAssessmentResultController {
    constructor(private readonly service: ViewAssessmentResultService) {}

    @RequirePermission('assessment_result', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/assessment_result/:id',
        tags: ['assessment_result'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assessment_result fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assessment_result not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getAssessmentResult(
        @Param() params: AssessmentResultIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'assessment_result fetched',
        });
    }
}
