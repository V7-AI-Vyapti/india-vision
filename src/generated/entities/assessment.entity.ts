import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Assessment extends CustomTypeormEntityBase {
    static tableName = 'assessment';
    assessment_id = CustomTypeormFields.AutoPK({ db_column: 'assessment_id' });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    method = CustomTypeormFields.CharacterString({ db_column: 'method' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    assessment_date = CustomTypeormFields.Integer({
        db_column: 'assessment_date',
    });
    assessment_agency_id = CustomTypeormFields.FK({
        model_name: 'organisation',
        db_column: 'assessment_agency_id',
    });
    batch_id = CustomTypeormFields.FK({
        model_name: 'batch',
        db_column: 'batch_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
