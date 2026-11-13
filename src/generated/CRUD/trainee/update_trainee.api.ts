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
import { Trainee } from '@entities/trainee.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTraineeRequestSchema = z
    .object({
        full_name: z.string(),
        father_name: z.string(),
        dob: z.number().int(),
        gender: z.string(),
        aadhaar: z.string(),
        mobile: z.string(),
        address: z.string(),
        bocw_reg_no: z.string(),
        bank_account: z.string(),
        ifsc: z.string(),
        experience_years: z.number().int(),
        source: z.string(),
        eligibility_status: z.string(),
        photo_url: z.string(),
        training_assignment_id: z.number().int().positive(),
        district_id: z.number().int().positive(),
        proposed_job_role_id: z.number().int().positive(),
        mobiliser_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTraineeRequestDto extends createZodDto(
    UpdateTraineeRequestSchema,
) {}

export const TraineeIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TraineeIdParamsDto extends createZodDto(TraineeIdParamsSchema) {}

@Injectable()
export class UpdateTraineeService {
    async update(id: number, body: UpdateTraineeRequestDto) {
        const record = await Trainee.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('trainee not found');
        }
        const parsed = UpdateTraineeRequestSchema.parse(body);
        await Trainee.updateByPk(id, parsed);
        return await Trainee.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTraineeController {
    constructor(private readonly service: UpdateTraineeService) {}

    @RequirePermission('trainee', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/trainee/:id',
        tags: ['trainee'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'trainee updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'trainee not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTrainee(
        @Param() params: TraineeIdParamsDto,
        @Body() body: UpdateTraineeRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'trainee updated',
        });
    }
}
