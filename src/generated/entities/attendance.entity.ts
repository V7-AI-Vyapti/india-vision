import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Attendance extends CustomTypeormEntityBase {
    static tableName = 'attendance';
    attendance_id = CustomTypeormFields.AutoPK({ db_column: 'attendance_id' });
    method = CustomTypeormFields.CharacterString({ db_column: 'method' });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    photo_url = CustomTypeormFields.Text({ db_column: 'photo_url' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
    });
    training_day_id = CustomTypeormFields.FK({
        model_name: 'training_day',
        db_column: 'training_day_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
