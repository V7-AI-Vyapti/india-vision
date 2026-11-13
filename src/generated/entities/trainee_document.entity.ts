import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TraineeDocument extends CustomTypeormEntityBase {
    static tableName = 'trainee_document';
    trainee_document_id = CustomTypeormFields.AutoPK({
        db_column: 'trainee_document_id',
    });
    doc_type = CustomTypeormFields.CharacterString({ db_column: 'doc_type' });
    file_url = CustomTypeormFields.Text({ db_column: 'file_url' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
