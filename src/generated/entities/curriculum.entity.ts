import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Curriculum extends CustomTypeormEntityBase {
    static tableName = 'curriculum';
    curriculum_id = CustomTypeormFields.AutoPK({ db_column: 'curriculum_id' });
    title = CustomTypeormFields.CharacterString({ db_column: 'title' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    duration_days = CustomTypeormFields.Integer({ db_column: 'duration_days' });
    total_hours = CustomTypeormFields.Integer({ db_column: 'total_hours' });
    job_role_id = CustomTypeormFields.FK({
        model_name: 'job_role',
        db_column: 'job_role_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
