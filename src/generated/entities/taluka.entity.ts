import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Taluka extends CustomTypeormEntityBase {
    static tableName = 'taluka';
    taluka_id = CustomTypeormFields.AutoPK({ db_column: 'taluka_id' });
    taluka_name = CustomTypeormFields.CharacterString({
        db_column: 'taluka_name',
    });
    district_id = CustomTypeormFields.FK({
        model_name: 'district',
        db_column: 'district_id',
    });
    is_active = CustomTypeormFields.Boolean({ db_column: 'is_active' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
