import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class JobRole extends CustomTypeormEntityBase {
    static tableName = 'job_role';
    job_role_id = CustomTypeormFields.AutoPK({ db_column: 'job_role_id' });
    job_role_name = CustomTypeormFields.CharacterString({
        db_column: 'job_role_name',
    });
    nsqf_level = CustomTypeormFields.CharacterString({
        db_column: 'nsqf_level',
    });
    sector = CustomTypeormFields.CharacterString({ db_column: 'sector' });
    awarding_body = CustomTypeormFields.CharacterString({
        db_column: 'awarding_body',
    });
    notional_hours = CustomTypeormFields.Integer({
        db_column: 'notional_hours',
    });
    credits = CustomTypeormFields.Decimal({ db_column: 'credits' });
    qp_nos_code = CustomTypeormFields.CharacterString({
        db_column: 'qp_nos_code',
    });
    valid_till = CustomTypeormFields.Integer({ db_column: 'valid_till' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
