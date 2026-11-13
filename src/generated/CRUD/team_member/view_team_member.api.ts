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
import { TeamMember } from '@entities/team_member.entity';
import { API_METHOD_TYPES, HTTP_STATUS_CODES } from '@vulcan/shared/constants';
import { VULCAN_API_CONFIG } from '@vulcan/vulcan.config';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AUTH_BEARER_DECORATORS, AUTH_MESSAGES } from '@vyapti/auth';
import { RequirePermission } from '@vyapti/rbac';

export const TeamMemberIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export class TeamMemberIdParamsDto extends createZodDto(
    TeamMemberIdParamsSchema,
) {}

@Injectable()
export class ViewTeamMemberService {
    async getById(id: number) {
        const record = await TeamMember.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('team_member not found');
        }
        return record;
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class ViewTeamMemberController {
    constructor(private readonly service: ViewTeamMemberService) {}

    @RequirePermission('team_member', 'view')
    @buildEndpoint({
        method: API_METHOD_TYPES.GET,
        path: '/team_member/:id',
        tags: ['team_member'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'team_member fetched',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'team_member not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async getTeamMember(
        @Param() params: TeamMemberIdParamsDto,
    ): Promise<ApiSuccessResponse<unknown>> {
        const data = await this.service.getById(params.id);
        return apiSuccess(data, {
            message: 'team_member fetched',
        });
    }
}
