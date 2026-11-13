import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TrainingCentreDocument extends CustomTypeormEntityBase {
    static tableName = 'training_centre_document';
    training_centre_document_id = CustomTypeormFields.AutoPK({
        db_column: 'training_centre_document_id',
    });
    doc_type = CustomTypeormFields.CharacterString({ db_column: 'doc_type' });
    file_url = CustomTypeormFields.Text({ db_column: 'file_url' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    training_centre_id = CustomTypeormFields.FK({
        model_name: 'training_centre',
        db_column: 'training_centre_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
