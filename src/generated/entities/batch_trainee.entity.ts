import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class BatchTrainee extends CustomTypeormEntityBase {
    static tableName = 'batch_trainee';
    batch_trainee_id = CustomTypeormFields.AutoPK({
        db_column: 'batch_trainee_id',
    });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    attendance_pct = CustomTypeormFields.Decimal({
        db_column: 'attendance_pct',
    });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
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
