import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class TrainingAssignment extends CustomTypeormEntityBase {
    static tableName = 'training_assignment';
    training_assignment_id = CustomTypeormFields.AutoPK({
        db_column: 'training_assignment_id',
    });
    assignment_name = CustomTypeormFields.CharacterString({
        db_column: 'assignment_name',
    });
    no_of_trainees = CustomTypeormFields.Integer({
        db_column: 'no_of_trainees',
    });
    start_date = CustomTypeormFields.Integer({ db_column: 'start_date' });
    end_date = CustomTypeormFields.Integer({ db_column: 'end_date' });
    batch_min_size = CustomTypeormFields.Integer({
        db_column: 'batch_min_size',
    });
    batch_max_size = CustomTypeormFields.Integer({
        db_column: 'batch_max_size',
    });
    rpl_guidelines = CustomTypeormFields.Text({ db_column: 'rpl_guidelines' });
    status = CustomTypeormFields.CharacterString({ db_column: 'status' });
    client_id = CustomTypeormFields.FK({
        model_name: 'organisation',
        db_column: 'client_id',
    });
    welfare_board_id = CustomTypeormFields.FK({
        model_name: 'organisation',
        db_column: 'welfare_board_id',
    });
    assessment_agency_id = CustomTypeormFields.FK({
        model_name: 'organisation',
        db_column: 'assessment_agency_id',
    });
    state_id = CustomTypeormFields.FK({
        model_name: 'state',
        db_column: 'state_id',
    });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
