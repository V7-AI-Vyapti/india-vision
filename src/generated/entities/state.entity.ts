import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class State extends CustomTypeormEntityBase {
    static tableName = 'state';
    state_id = CustomTypeormFields.AutoPK({ db_column: 'state_id' });
    state_name = CustomTypeormFields.CharacterString({
        db_column: 'state_name',
    });
    is_active = CustomTypeormFields.Boolean({ db_column: 'is_active' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
