import { Body, Controller, Injectable } from '@nestjs/common';
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

export const CreateTeamMemberRequestSchema = z.object({
    role_in_project: z.string(),
    reports_to_team_member_id: z.number().int(),
    staff_id: z.number().int().positive(),
    training_assignment_id: z.number().int().positive(),
});

export class CreateTeamMemberRequestDto extends createZodDto(
    CreateTeamMemberRequestSchema,
) {}

@Injectable()
export class CreateTeamMemberService {
    async create(body: CreateTeamMemberRequestDto) {
        const parsed = CreateTeamMemberRequestSchema.parse(body);
        return await TeamMember.createOne(parsed);
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class CreateTeamMemberController {
    constructor(private readonly service: CreateTeamMemberService) {}

    @RequirePermission('team_member', 'create')
    @buildEndpoint({
        method: API_METHOD_TYPES.POST,
        path: '/team_member',
        tags: ['team_member'],
        responses: {
            [HTTP_STATUS_CODES.CREATED]: 'team_member created',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async createTeamMember(
        @Body() body: CreateTeamMemberRequestDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.create(body);
        return apiSuccess(data, {
            message: 'team_member created',
        });
    }
}
