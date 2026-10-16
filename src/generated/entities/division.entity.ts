import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Division extends CustomTypeormEntityBase {
    static tableName = 'division';
    division_id = CustomTypeormFields.AutoPK({ db_column: 'division_id' });
    division_name = CustomTypeormFields.CharacterString({
        db_column: 'division_name',
    });
    state_id = CustomTypeormFields.FK({
        model_name: 'state',
        db_column: 'state_id',
    });
    is_active = CustomTypeormFields.Boolean({ db_column: 'is_active' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
