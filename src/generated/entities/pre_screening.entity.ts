import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class PreScreening extends CustomTypeormEntityBase {
    static tableName = 'pre_screening';
    pre_screening_id = CustomTypeormFields.AutoPK({
        db_column: 'pre_screening_id',
    });
    competencies_demonstrated = CustomTypeormFields.Text({
        db_column: 'competencies_demonstrated',
    });
    competencies_gap = CustomTypeormFields.Text({
        db_column: 'competencies_gap',
    });
    outcome = CustomTypeormFields.CharacterString({ db_column: 'outcome' });
    screened_on = CustomTypeormFields.Integer({ db_column: 'screened_on' });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
    });
    job_role_id = CustomTypeormFields.FK({
        model_name: 'job_role',
        db_column: 'job_role_id',
    });
    screened_by_id = CustomTypeormFields.FK({
        model_name: 'staff',
        db_column: 'screened_by_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
