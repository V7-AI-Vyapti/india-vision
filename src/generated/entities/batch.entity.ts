import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class Batch extends CustomTypeormEntityBase {
    static tableName = 'batch';
    batch_id = CustomTypeormFields.AutoPK({ db_column: 'batch_id' });
    batch_code = CustomTypeormFields.CharacterString({
        db_column: 'batch_code',
    });
    start_date = CustomTypeormFields.Integer({ db_column: 'start_date' });
    end_date = CustomTypeormFields.Integer({ db_column: 'end_date' });
    assessment_date = CustomTypeormFields.Integer({
        db_column: 'assessment_date',
    });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    training_assignment_id = CustomTypeormFields.FK({
        model_name: 'training_assignment',
        db_column: 'training_assignment_id',
    });
    job_role_id = CustomTypeormFields.FK({
        model_name: 'job_role',
        db_column: 'job_role_id',
    });
    training_centre_id = CustomTypeormFields.FK({
        model_name: 'training_centre',
        db_column: 'training_centre_id',
    });
    trainer_id = CustomTypeormFields.FK({
        model_name: 'trainer',
        db_column: 'trainer_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
