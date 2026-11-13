import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TrainingCentre extends CustomTypeormEntityBase {
    static tableName = 'training_centre';
    training_centre_id = CustomTypeormFields.AutoPK({
        db_column: 'training_centre_id',
    });
    centre_name = CustomTypeormFields.CharacterString({
        db_column: 'centre_name',
    });
    address = CustomTypeormFields.Text({ db_column: 'address' });
    gps_lat = CustomTypeormFields.Decimal({ db_column: 'gps_lat' });
    gps_long = CustomTypeormFields.Decimal({ db_column: 'gps_long' });
    centre_type = CustomTypeormFields.CharacterString({
        db_column: 'centre_type',
    });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    district_id = CustomTypeormFields.FK({
        model_name: 'district',
        db_column: 'district_id',
    });
    training_assignment_id = CustomTypeormFields.FK({
        model_name: 'training_assignment',
        db_column: 'training_assignment_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
