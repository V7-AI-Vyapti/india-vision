import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class AssignmentTarget extends CustomTypeormEntityBase {
    static tableName = 'assignment_target';
    assignment_target_id = CustomTypeormFields.AutoPK({
        db_column: 'assignment_target_id',
    });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    target_count = CustomTypeormFields.Integer({ db_column: 'target_count' });
    job_role_id = CustomTypeormFields.FK({
        model_name: 'job_role',
        db_column: 'job_role_id',
    });
    district_id = CustomTypeormFields.FK({
        model_name: 'district',
        db_column: 'district_id',
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
