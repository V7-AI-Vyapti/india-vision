import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Trainer extends CustomTypeormEntityBase {
    static tableName = 'trainer';
    trainer_id = CustomTypeormFields.AutoPK({ db_column: 'trainer_id' });
    aadhaar = CustomTypeormFields.CharacterString({ db_column: 'aadhaar' });
    pan = CustomTypeormFields.CharacterString({ db_column: 'pan' });
    sidh_id = CustomTypeormFields.CharacterString({ db_column: 'sidh_id' });
    tot_cert_no = CustomTypeormFields.CharacterString({
        db_column: 'tot_cert_no',
    });
    tot_valid_till = CustomTypeormFields.Integer({
        db_column: 'tot_valid_till',
    });
    experience_years = CustomTypeormFields.Integer({
        db_column: 'experience_years',
    });
    is_deployable = CustomTypeormFields.Boolean({ db_column: 'is_deployable' });
    feedback_rating = CustomTypeormFields.Decimal({
        db_column: 'feedback_rating',
    });
    staff_id = CustomTypeormFields.FK({
        model_name: 'staff',
        db_column: 'staff_id',
    });
    primary_job_role_id = CustomTypeormFields.FK({
        model_name: 'job_role',
        db_column: 'primary_job_role_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
