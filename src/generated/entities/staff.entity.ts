import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Staff extends CustomTypeormEntityBase {
    static tableName = 'staff';
    staff_id = CustomTypeormFields.AutoPK({ db_column: 'staff_id' });
    base_role = CustomTypeormFields.CharacterString({ db_column: 'base_role' });
    email = CustomTypeormFields.CharacterString({ db_column: 'email' });
    mobile = CustomTypeormFields.CharacterString({ db_column: 'mobile' });
    full_name = CustomTypeormFields.CharacterString({ db_column: 'full_name' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    home_district_id = CustomTypeormFields.FK({
        model_name: 'district',
        db_column: 'home_district_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
