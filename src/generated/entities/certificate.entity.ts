import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Certificate extends CustomTypeormEntityBase {
    static tableName = 'certificate';
    certificate_id = CustomTypeormFields.AutoPK({
        db_column: 'certificate_id',
    });
    certificate_no = CustomTypeormFields.CharacterString({
        db_column: 'certificate_no',
    });
    issued_at = CustomTypeormFields.Integer({ db_column: 'issued_at' });
    qr_url = CustomTypeormFields.Text({ db_column: 'qr_url' });
    abc_uploaded = CustomTypeormFields.Boolean({ db_column: 'abc_uploaded' });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
    });
    assessment_id = CustomTypeormFields.FK({
        model_name: 'assessment',
        db_column: 'assessment_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
