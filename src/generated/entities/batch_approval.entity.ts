import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class BatchApproval extends CustomTypeormEntityBase {
    static tableName = 'batch_approval';
    batch_approval_id = CustomTypeormFields.AutoPK({
        db_column: 'batch_approval_id',
    });
    submitted_at = CustomTypeormFields.Integer({ db_column: 'submitted_at' });
    approved_at = CustomTypeormFields.Integer({ db_column: 'approved_at' });
    decision = CustomTypeormFields.CharacterString({ db_column: 'decision' });
    conditions = CustomTypeormFields.Text({ db_column: 'conditions' });
    batch_id = CustomTypeormFields.FK({
        model_name: 'batch',
        db_column: 'batch_id',
    });
    submitted_by_id = CustomTypeormFields.FK({
        model_name: 'staff',
        db_column: 'submitted_by_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
