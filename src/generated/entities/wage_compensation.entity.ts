import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class WageCompensation extends CustomTypeormEntityBase {
    static tableName = 'wage_compensation';
    wage_compensation_id = CustomTypeormFields.AutoPK({
        db_column: 'wage_compensation_id',
    });
    days = CustomTypeormFields.Integer({ db_column: 'days' });
    amount = CustomTypeormFields.Decimal({ db_column: 'amount' });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    dbt_reference = CustomTypeormFields.CharacterString({
        db_column: 'dbt_reference',
    });
    received = CustomTypeormFields.Boolean({ db_column: 'received' });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
    });
    batch_id = CustomTypeormFields.FK({
        model_name: 'batch',
        db_column: 'batch_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
