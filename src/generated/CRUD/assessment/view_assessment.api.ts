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
import { Assessment } from '@entities/assessment.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const AssessmentIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class AssessmentIdParamsDto extends createZodDto(
    AssessmentIdParamsSchema,
) {}

@Injectable()
export class ViewAssessmentService {
    async getById(id: number) {
        const record = await Assessment.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assessment not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewAssessmentController {
    constructor(private readonly service: ViewAssessmentService) {}

    @RequirePermission('assessment', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/assessment/:id',
        tags: ['assessment'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assessment fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assessment not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getAssessment(
        @Param() params: AssessmentIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'assessment fetched',
        });
    }
}
