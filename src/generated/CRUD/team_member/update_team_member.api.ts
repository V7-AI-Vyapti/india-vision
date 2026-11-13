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
import { TeamMember } from '@entities/team_member.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const UpdateTeamMemberRequestSchema = z
    .object({
        role_in_project: z.string(),
        reports_to_team_member_id: z.number().int(),
        staff_id: z.number().int().positive(),
        training_assignment_id: z.number().int().positive(),
    })
    .partial();

export class UpdateTeamMemberRequestDto extends createZodDto(
    UpdateTeamMemberRequestSchema,
) {}

export const TeamMemberIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TeamMemberIdParamsDto extends createZodDto(
    TeamMemberIdParamsSchema,
) {}

@Injectable()
export class UpdateTeamMemberService {
    async update(id: number, body: UpdateTeamMemberRequestDto) {
        const record = await TeamMember.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('team_member not found');
        }
        const parsed = UpdateTeamMemberRequestSchema.parse(body);
        await TeamMember.updateByPk(id, parsed);
        return await TeamMember.getByPk(id);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class UpdateTeamMemberController {
    constructor(private readonly service: UpdateTeamMemberService) {}

    @RequirePermission('team_member', 'update')
    @buildEndpoint({
        method: API_METHOD_TYPES.PATCH,
        path: '/team_member/:id',
        tags: ['team_member'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'team_member updated',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'team_member not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async updateTeamMember(
        @Param() params: TeamMemberIdParamsDto,
        @Body() body: UpdateTeamMemberRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.update(params.id, body);
        return apiSuccess(data, {
            message: 'team_member updated',
        });
    }
}
