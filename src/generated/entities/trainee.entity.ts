import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Trainee extends CustomTypeormEntityBase {
    static tableName = 'trainee';
    trainee_id = CustomTypeormFields.AutoPK({ db_column: 'trainee_id' });
    full_name = CustomTypeormFields.CharacterString({ db_column: 'full_name' });
    father_name = CustomTypeormFields.CharacterString({
        db_column: 'father_name',
    });
    dob = CustomTypeormFields.Integer({ db_column: 'dob' });
    gender = CustomTypeormFields.CharacterString({ db_column: 'gender' });
    aadhaar = CustomTypeormFields.CharacterString({ db_column: 'aadhaar' });
    mobile = CustomTypeormFields.CharacterString({ db_column: 'mobile' });
    address = CustomTypeormFields.Text({ db_column: 'address' });
    bocw_reg_no = CustomTypeormFields.CharacterString({
        db_column: 'bocw_reg_no',
    });
    bank_account = CustomTypeormFields.CharacterString({
        db_column: 'bank_account',
    });
    ifsc = CustomTypeormFields.CharacterString({ db_column: 'ifsc' });
    experience_years = CustomTypeormFields.Integer({
        db_column: 'experience_years',
    });
    source = CustomTypeormFields.CharacterString({ db_column: 'source' });
    eligibility_status = CustomTypeormFields.CharacterString({
        db_column: 'eligibility_status',
    });
    photo_url = CustomTypeormFields.Text({ db_column: 'photo_url' });
    training_assignment_id = CustomTypeormFields.FK({
        model_name: 'training_assignment',
        db_column: 'training_assignment_id',
    });
    district_id = CustomTypeormFields.FK({
        model_name: 'district',
        db_column: 'district_id',
    });
    proposed_job_role_id = CustomTypeormFields.FK({
        model_name: 'job_role',
        db_column: 'proposed_job_role_id',
    });
    mobiliser_id = CustomTypeormFields.FK({
        model_name: 'staff',
        db_column: 'mobiliser_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
