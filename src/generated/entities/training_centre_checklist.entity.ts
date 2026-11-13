import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TrainingCentreChecklist extends CustomTypeormEntityBase {
    static tableName = 'training_centre_checklist';
    training_centre_checklist_id = CustomTypeormFields.AutoPK({
        db_column: 'training_centre_checklist_id',
    });
    item_name = CustomTypeormFields.CharacterString({ db_column: 'item_name' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    training_centre_id = CustomTypeormFields.FK({
        model_name: 'training_centre',
        db_column: 'training_centre_id',
    });
    verified = CustomTypeormFields.Boolean({ db_column: 'verified' });
    is_available = CustomTypeormFields.Boolean({ db_column: 'is_available' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
