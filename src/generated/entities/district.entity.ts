import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class District extends CustomTypeormEntityBase {
    static tableName = 'district';
    district_id = CustomTypeormFields.AutoPK({ db_column: 'district_id' });
    district_name = CustomTypeormFields.CharacterString({
        db_column: 'district_name',
    });
    division_id = CustomTypeormFields.FK({
        model_name: 'division',
        db_column: 'division_id',
    });
    is_active = CustomTypeormFields.Boolean({ db_column: 'is_active' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
