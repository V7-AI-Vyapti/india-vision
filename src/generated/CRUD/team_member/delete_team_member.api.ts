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
export class DeleteTeamMemberService {
    async remove(id: number) {
        const record = await TeamMember.getByPk(id);
        if (!record || record['deleted_at'] != null) {
            throw new NotFoundException('team_member not found');
        }
        await TeamMember.updateByPk(id, {
            deleted_at: Date.now(),
        });
        return { deleted: true };
    }
}

@Controller({
    path: VULCAN_API_CONFIG.path,
    version: VULCAN_API_CONFIG.version,
})
export class DeleteTeamMemberController {
    constructor(private readonly service: DeleteTeamMemberService) {}

    @RequirePermission('team_member', 'delete')
    @buildEndpoint({
        method: API_METHOD_TYPES.DELETE,
        path: '/team_member/:id',
        tags: ['team_member'],
        responses: {
            [HTTP_STATUS_CODES.OK]: 'team_member deleted',
            [HTTP_STATUS_CODES.NOT_FOUND]: 'team_member not found',
            [HTTP_STATUS_CODES.UNAUTHORIZED]: AUTH_MESSAGES.UNAUTHORIZED,
        },
        decorators: AUTH_BEARER_DECORATORS,
    })
    async deleteTeamMember(
        @Param() params: TeamMemberIdParamsDto,
    ): Promise<ApiSuccessResponse<{ deleted: boolean }>> {
        const data = await this.service.remove(params.id);
        return apiSuccess(data, {
            message: 'team_member deleted',
        });
    }
}
