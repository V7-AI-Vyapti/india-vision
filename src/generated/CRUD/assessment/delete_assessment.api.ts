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
export class DeleteAssessmentService {
    async remove(id: number) {
        const record = await Assessment.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('assessment not found');
        }
        await Assessment.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteAssessmentController {
    constructor(private readonly service: DeleteAssessmentService) {}

    @RequirePermission('assessment', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/assessment/:id',
        tags: ['assessment'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'assessment deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'assessment not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteAssessment(
        @Param() params: AssessmentIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'assessment deleted',
        });
    }
}
