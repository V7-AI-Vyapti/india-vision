import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TrainingDay extends CustomTypeormEntityBase {
    static tableName = 'training_day';
    training_day_id = CustomTypeormFields.AutoPK({
        db_column: 'training_day_id',
    });
    training_date = CustomTypeormFields.Integer({ db_column: 'training_date' });
    topic = CustomTypeormFields.CharacterString({ db_column: 'topic' });
    planned_hours = CustomTypeormFields.Integer({ db_column: 'planned_hours' });
    actual_hours = CustomTypeormFields.Integer({ db_column: 'actual_hours' });
    present_count = CustomTypeormFields.Integer({ db_column: 'present_count' });
    remarks = CustomTypeormFields.Text({ db_column: 'remarks' });
    batch_id = CustomTypeormFields.FK({
        model_name: 'batch',
        db_column: 'batch_id',
    });
    trainer_id = CustomTypeormFields.FK({
        model_name: 'trainer',
        db_column: 'trainer_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
