import { CustomTypeormEntityBase, CustomTypeormFields } from '@vyapti/core';
export class AssessmentResult extends CustomTypeormEntityBase {
    static tableName = 'assessment_result';
    assessment_result_id = CustomTypeormFields.AutoPK({
        db_column: 'assessment_result_id',
    });
    cert_status = CustomTypeormFields.CharacterString({
        db_column: 'cert_status',
    });
    result = CustomTypeormFields.CharacterString({ db_column: 'result' });
    updated_at = CustomTypeormFields.Integer({ db_column: 'updated_at' });
    created_at = CustomTypeormFields.Integer({ db_column: 'created_at' });
    score = CustomTypeormFields.Decimal({ db_column: 'score' });
    trainee_id = CustomTypeormFields.FK({
        model_name: 'trainee',
        db_column: 'trainee_id',
    });
    assessment_id = CustomTypeormFields.FK({
        model_name: 'assessment',
        db_column: 'assessment_id',
    });
    deleted_at = CustomTypeormFields.Integer({
        db_column: 'deleted_at',
        null: true,
    });
}
