import { buildEntitySchema } from '@vyapti/core';
import { Assessment } from './assessment.entity';
import { AssessmentResult } from './assessment_result.entity';
import { AssignmentTarget } from './assignment_target.entity';
import { Attendance } from './attendance.entity';
import { Batch } from './batch.entity';
import { BatchApproval } from './batch_approval.entity';
import { BatchTrainee } from './batch_trainee.entity';
import { Certificate } from './certificate.entity';
import { Curriculum } from './curriculum.entity';
import { District } from './district.entity';
import { Division } from './division.entity';
import { JobRole } from './job_role.entity';
import { Loi } from './loi.entity';
import { Organisation } from './organisation.entity';
import { PreScreening } from './pre_screening.entity';
import { Staff } from './staff.entity';
import { State } from './state.entity';
import { Taluka } from './taluka.entity';
import { TeamMember } from './team_member.entity';
import { Trainee } from './trainee.entity';
import { TraineeDocument } from './trainee_document.entity';
import { Trainer } from './trainer.entity';
import { TrainerDocument } from './trainer_document.entity';
import { TrainingAssignment } from './training_assignment.entity';
import { TrainingCentre } from './training_centre.entity';
import { TrainingCentreChecklist } from './training_centre_checklist.entity';
import { TrainingCentreDocument } from './training_centre_document.entity';
import { TrainingDay } from './training_day.entity';
import { WageCompensation } from './wage_compensation.entity';

export const entitySchemas = [
    buildEntitySchema(Assessment),
    buildEntitySchema(AssessmentResult),
    buildEntitySchema(AssignmentTarget),
    buildEntitySchema(Attendance),
    buildEntitySchema(Batch),
    buildEntitySchema(BatchApproval),
    buildEntitySchema(BatchTrainee),
    buildEntitySchema(Certificate),
    buildEntitySchema(Curriculum),
    buildEntitySchema(District),
    buildEntitySchema(Division),
    buildEntitySchema(JobRole),
    buildEntitySchema(Loi),
    buildEntitySchema(Organisation),
    buildEntitySchema(PreScreening),
    buildEntitySchema(Staff),
    buildEntitySchema(State),
    buildEntitySchema(Taluka),
    buildEntitySchema(TeamMember),
    buildEntitySchema(Trainee),
    buildEntitySchema(TraineeDocument),
    buildEntitySchema(Trainer),
    buildEntitySchema(TrainerDocument),
    buildEntitySchema(TrainingAssignment),
    buildEntitySchema(TrainingCentre),
    buildEntitySchema(TrainingCentreChecklist),
    buildEntitySchema(TrainingCentreDocument),
    buildEntitySchema(TrainingDay),
    buildEntitySchema(WageCompensation),
];
