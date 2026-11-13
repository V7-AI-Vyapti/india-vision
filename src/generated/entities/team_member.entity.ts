import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TeamMember extends CustomTypeormEntityBase {
    static tableName = 'team_member';
    team_member_id = CustomTypeormFields.AutoPK({
        db_column: 'team_member_id',
    });
    role_in_project = CustomTypeormFields.CharacterString({
        db_column: 'role_in_project',
    });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    reports_to_team_member_id = CustomTypeormFields.Integer({
        db_column: 'reports_to_team_member_id',
    });
    staff_id = CustomTypeormFields.FK({
        model_name: 'staff',
        db_column: 'staff_id',
    });
    training_assignment_id = CustomTypeormFields.FK({
        model_name: 'training_assignment',
        db_column: 'training_assignment_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
