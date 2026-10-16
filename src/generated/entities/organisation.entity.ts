import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Organisation extends CustomTypeormEntityBase {
    static tableName = 'organisation';
    organisation_id = CustomTypeormFields.AutoPK({
        db_column: 'organisation_id',
    });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    organisation_type = CustomTypeormFields.CharacterString({
        db_column: 'organisation_type',
    });
    legal_name = CustomTypeormFields.CharacterString({
        db_column: 'legal_name',
    });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    is_authorised_to_train = CustomTypeormFields.Boolean({
        db_column: 'is_authorised_to_train',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
