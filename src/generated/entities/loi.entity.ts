import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Loi extends CustomTypeormEntityBase {
    static tableName = 'loi';
    loi_id = CustomTypeormFields.AutoPK({ db_column: 'loi_id' });
    loi_date = CustomTypeormFields.Integer({ db_column: 'loi_date' });
    source = CustomTypeormFields.CharacterString({ db_column: 'source' });
    poc_name = CustomTypeormFields.CharacterString({ db_column: 'poc_name' });
    poc_designation = CustomTypeormFields.CharacterString({
        db_column: 'poc_designation',
    });
    poc_mobile = CustomTypeormFields.CharacterString({
        db_column: 'poc_mobile',
    });
    poc_email = CustomTypeormFields.CharacterString({ db_column: 'poc_email' });
    file_url = CustomTypeormFields.Text({ db_column: 'file_url' });
    training_assignment_id = CustomTypeormFields.FK({
        model_name: 'training_assignment',
        db_column: 'training_assignment_id',
    });
    district_id = CustomTypeormFields.FK({
        model_name: 'district',
        db_column: 'district_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
