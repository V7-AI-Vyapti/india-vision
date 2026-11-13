import { Module } from '@nestjs/common';
import {
    CreateAssessmentController,
    CreateAssessmentService,
} from '@generated-crud/assessment/create_assessment.api';
import {
    CreateAssessmentResultController,
    CreateAssessmentResultService,
} from '@generated-crud/assessment_result/create_assessment_result.api';
import {
    CreateAssignmentTargetController,
    CreateAssignmentTargetService,
} from '@generated-crud/assignment_target/create_assignment_target.api';
import {
    CreateAttendanceController,
    CreateAttendanceService,
} from '@generated-crud/attendance/create_attendance.api';
import {
    CreateBatchApprovalController,
    CreateBatchApprovalService,
} from '@generated-crud/batch_approval/create_batch_approval.api';
import {
    CreateBatchController,
    CreateBatchService,
} from '@generated-crud/batch/create_batch.api';
import {
    CreateBatchTraineeController,
    CreateBatchTraineeService,
} from '@generated-crud/batch_trainee/create_batch_trainee.api';
import {
    CreateCertificateController,
    CreateCertificateService,
} from '@generated-crud/certificate/create_certificate.api';
import {
    CreateCurriculumController,
    CreateCurriculumService,
} from '@generated-crud/curriculum/create_curriculum.api';
import {
    CreateDistrictController,
    CreateDistrictService,
} from '@generated-crud/district/create_district.api';
import {
    CreateDivisionController,
    CreateDivisionService,
} from '@generated-crud/division/create_division.api';
import {
    CreateJobRoleController,
    CreateJobRoleService,
} from '@generated-crud/job_role/create_job_role.api';
import {
    CreateLoiController,
    CreateLoiService,
} from '@generated-crud/loi/create_loi.api';
import {
    CreateOrganisationController,
    CreateOrganisationService,
} from '@generated-crud/organisation/create_organisation.api';
import {
    CreatePreScreeningController,
    CreatePreScreeningService,
} from '@generated-crud/pre_screening/create_pre_screening.api';
import {
    CreateStaffController,
    CreateStaffService,
} from '@generated-crud/staff/create_staff.api';
import {
    CreateStateController,
    CreateStateService,
} from '@generated-crud/state/create_state.api';
import {
    CreateTalukaController,
    CreateTalukaService,
} from '@generated-crud/taluka/create_taluka.api';
import {
    CreateTeamMemberController,
    CreateTeamMemberService,
} from '@generated-crud/team_member/create_team_member.api';
import {
    CreateTraineeController,
    CreateTraineeService,
} from '@generated-crud/trainee/create_trainee.api';
import {
    CreateTraineeDocumentController,
    CreateTraineeDocumentService,
} from '@generated-crud/trainee_document/create_trainee_document.api';
import {
    CreateTrainerController,
    CreateTrainerService,
} from '@generated-crud/trainer/create_trainer.api';
import {
    CreateTrainerDocumentController,
    CreateTrainerDocumentService,
} from '@generated-crud/trainer_document/create_trainer_document.api';
import {
    CreateTrainingAssignmentController,
    CreateTrainingAssignmentService,
} from '@generated-crud/training_assignment/create_training_assignment.api';
import {
    CreateTrainingCentreChecklistController,
    CreateTrainingCentreChecklistService,
} from '@generated-crud/training_centre_checklist/create_training_centre_checklist.api';
import {
    CreateTrainingCentreController,
    CreateTrainingCentreService,
} from '@generated-crud/training_centre/create_training_centre.api';
import {
    CreateTrainingCentreDocumentController,
    CreateTrainingCentreDocumentService,
} from '@generated-crud/training_centre_document/create_training_centre_document.api';
import {
    CreateTrainingDayController,
    CreateTrainingDayService,
} from '@generated-crud/training_day/create_training_day.api';
import {
    CreateWageCompensationController,
    CreateWageCompensationService,
} from '@generated-crud/wage_compensation/create_wage_compensation.api';
import {
    DeleteAssessmentController,
    DeleteAssessmentService,
} from '@generated-crud/assessment/delete_assessment.api';
import {
    DeleteAssessmentResultController,
    DeleteAssessmentResultService,
} from '@generated-crud/assessment_result/delete_assessment_result.api';
import {
    DeleteAssignmentTargetController,
    DeleteAssignmentTargetService,
} from '@generated-crud/assignment_target/delete_assignment_target.api';
import {
    DeleteAttendanceController,
    DeleteAttendanceService,
} from '@generated-crud/attendance/delete_attendance.api';
import {
    DeleteBatchApprovalController,
    DeleteBatchApprovalService,
} from '@generated-crud/batch_approval/delete_batch_approval.api';
import {
    DeleteBatchController,
    DeleteBatchService,
} from '@generated-crud/batch/delete_batch.api';
import {
    DeleteBatchTraineeController,
    DeleteBatchTraineeService,
} from '@generated-crud/batch_trainee/delete_batch_trainee.api';
import {
    DeleteCertificateController,
    DeleteCertificateService,
} from '@generated-crud/certificate/delete_certificate.api';
import {
    DeleteCurriculumController,
    DeleteCurriculumService,
} from '@generated-crud/curriculum/delete_curriculum.api';
import {
    DeleteDistrictController,
    DeleteDistrictService,
} from '@generated-crud/district/delete_district.api';
import {
    DeleteDivisionController,
    DeleteDivisionService,
} from '@generated-crud/division/delete_division.api';
import {
    DeleteJobRoleController,
    DeleteJobRoleService,
} from '@generated-crud/job_role/delete_job_role.api';
import {
    DeleteLoiController,
    DeleteLoiService,
} from '@generated-crud/loi/delete_loi.api';
import {
    DeleteOrganisationController,
    DeleteOrganisationService,
} from '@generated-crud/organisation/delete_organisation.api';
import {
    DeletePreScreeningController,
    DeletePreScreeningService,
} from '@generated-crud/pre_screening/delete_pre_screening.api';
import {
    DeleteStaffController,
    DeleteStaffService,
} from '@generated-crud/staff/delete_staff.api';
import {
    DeleteStateController,
    DeleteStateService,
} from '@generated-crud/state/delete_state.api';
import {
    DeleteTalukaController,
    DeleteTalukaService,
} from '@generated-crud/taluka/delete_taluka.api';
import {
    DeleteTeamMemberController,
    DeleteTeamMemberService,
} from '@generated-crud/team_member/delete_team_member.api';
import {
    DeleteTraineeController,
    DeleteTraineeService,
} from '@generated-crud/trainee/delete_trainee.api';
import {
    DeleteTraineeDocumentController,
    DeleteTraineeDocumentService,
} from '@generated-crud/trainee_document/delete_trainee_document.api';
import {
    DeleteTrainerController,
    DeleteTrainerService,
} from '@generated-crud/trainer/delete_trainer.api';
import {
    DeleteTrainerDocumentController,
    DeleteTrainerDocumentService,
} from '@generated-crud/trainer_document/delete_trainer_document.api';
import {
    DeleteTrainingAssignmentController,
    DeleteTrainingAssignmentService,
} from '@generated-crud/training_assignment/delete_training_assignment.api';
import {
    DeleteTrainingCentreChecklistController,
    DeleteTrainingCentreChecklistService,
} from '@generated-crud/training_centre_checklist/delete_training_centre_checklist.api';
import {
    DeleteTrainingCentreController,
    DeleteTrainingCentreService,
} from '@generated-crud/training_centre/delete_training_centre.api';
import {
    DeleteTrainingCentreDocumentController,
    DeleteTrainingCentreDocumentService,
} from '@generated-crud/training_centre_document/delete_training_centre_document.api';
import {
    DeleteTrainingDayController,
    DeleteTrainingDayService,
} from '@generated-crud/training_day/delete_training_day.api';
import {
    DeleteWageCompensationController,
    DeleteWageCompensationService,
} from '@generated-crud/wage_compensation/delete_wage_compensation.api';
import {
    ListAssessmentController,
    ListAssessmentService,
} from '@generated-crud/assessment/list_assessment.api';
import {
    ListAssessmentResultController,
    ListAssessmentResultService,
} from '@generated-crud/assessment_result/list_assessment_result.api';
import {
    ListAssignmentTargetController,
    ListAssignmentTargetService,
} from '@generated-crud/assignment_target/list_assignment_target.api';
import {
    ListAttendanceController,
    ListAttendanceService,
} from '@generated-crud/attendance/list_attendance.api';
import {
    ListBatchApprovalController,
    ListBatchApprovalService,
} from '@generated-crud/batch_approval/list_batch_approval.api';
import {
    ListBatchController,
    ListBatchService,
} from '@generated-crud/batch/list_batch.api';
import {
    ListBatchTraineeController,
    ListBatchTraineeService,
} from '@generated-crud/batch_trainee/list_batch_trainee.api';
import {
    ListCertificateController,
    ListCertificateService,
} from '@generated-crud/certificate/list_certificate.api';
import {
    ListCurriculumController,
    ListCurriculumService,
} from '@generated-crud/curriculum/list_curriculum.api';
import {
    ListDistrictController,
    ListDistrictService,
} from '@generated-crud/district/list_district.api';
import {
    ListDivisionController,
    ListDivisionService,
} from '@generated-crud/division/list_division.api';
import {
    ListJobRoleController,
    ListJobRoleService,
} from '@generated-crud/job_role/list_job_role.api';
import {
    ListLoiController,
    ListLoiService,
} from '@generated-crud/loi/list_loi.api';
import {
    ListOrganisationController,
    ListOrganisationService,
} from '@generated-crud/organisation/list_organisation.api';
import {
    ListPreScreeningController,
    ListPreScreeningService,
} from '@generated-crud/pre_screening/list_pre_screening.api';
import {
    ListStaffController,
    ListStaffService,
} from '@generated-crud/staff/list_staff.api';
import {
    ListStateController,
    ListStateService,
} from '@generated-crud/state/list_state.api';
import {
    ListTalukaController,
    ListTalukaService,
} from '@generated-crud/taluka/list_taluka.api';
import {
    ListTeamMemberController,
    ListTeamMemberService,
} from '@generated-crud/team_member/list_team_member.api';
import {
    ListTraineeController,
    ListTraineeService,
} from '@generated-crud/trainee/list_trainee.api';
import {
    ListTraineeDocumentController,
    ListTraineeDocumentService,
} from '@generated-crud/trainee_document/list_trainee_document.api';
import {
    ListTrainerController,
    ListTrainerService,
} from '@generated-crud/trainer/list_trainer.api';
import {
    ListTrainerDocumentController,
    ListTrainerDocumentService,
} from '@generated-crud/trainer_document/list_trainer_document.api';
import {
    ListTrainingAssignmentController,
    ListTrainingAssignmentService,
} from '@generated-crud/training_assignment/list_training_assignment.api';
import {
    ListTrainingCentreChecklistController,
    ListTrainingCentreChecklistService,
} from '@generated-crud/training_centre_checklist/list_training_centre_checklist.api';
import {
    ListTrainingCentreController,
    ListTrainingCentreService,
} from '@generated-crud/training_centre/list_training_centre.api';
import {
    ListTrainingCentreDocumentController,
    ListTrainingCentreDocumentService,
} from '@generated-crud/training_centre_document/list_training_centre_document.api';
import {
    ListTrainingDayController,
    ListTrainingDayService,
} from '@generated-crud/training_day/list_training_day.api';
import {
    ListWageCompensationController,
    ListWageCompensationService,
} from '@generated-crud/wage_compensation/list_wage_compensation.api';
import {
    UpdateAssessmentController,
    UpdateAssessmentService,
} from '@generated-crud/assessment/update_assessment.api';
import {
    UpdateAssessmentResultController,
    UpdateAssessmentResultService,
} from '@generated-crud/assessment_result/update_assessment_result.api';
import {
    UpdateAssignmentTargetController,
    UpdateAssignmentTargetService,
} from '@generated-crud/assignment_target/update_assignment_target.api';
import {
    UpdateAttendanceController,
    UpdateAttendanceService,
} from '@generated-crud/attendance/update_attendance.api';
import {
    UpdateBatchApprovalController,
    UpdateBatchApprovalService,
} from '@generated-crud/batch_approval/update_batch_approval.api';
import {
    UpdateBatchController,
    UpdateBatchService,
} from '@generated-crud/batch/update_batch.api';
import {
    UpdateBatchTraineeController,
    UpdateBatchTraineeService,
} from '@generated-crud/batch_trainee/update_batch_trainee.api';
import {
    UpdateCertificateController,
    UpdateCertificateService,
} from '@generated-crud/certificate/update_certificate.api';
import {
    UpdateCurriculumController,
    UpdateCurriculumService,
} from '@generated-crud/curriculum/update_curriculum.api';
import {
    UpdateDistrictController,
    UpdateDistrictService,
} from '@generated-crud/district/update_district.api';
import {
    UpdateDivisionController,
    UpdateDivisionService,
} from '@generated-crud/division/update_division.api';
import {
    UpdateJobRoleController,
    UpdateJobRoleService,
} from '@generated-crud/job_role/update_job_role.api';
import {
    UpdateLoiController,
    UpdateLoiService,
} from '@generated-crud/loi/update_loi.api';
import {
    UpdateOrganisationController,
    UpdateOrganisationService,
} from '@generated-crud/organisation/update_organisation.api';
import {
    UpdatePreScreeningController,
    UpdatePreScreeningService,
} from '@generated-crud/pre_screening/update_pre_screening.api';
import {
    UpdateStaffController,
    UpdateStaffService,
} from '@generated-crud/staff/update_staff.api';
import {
    UpdateStateController,
    UpdateStateService,
} from '@generated-crud/state/update_state.api';
import {
    UpdateTalukaController,
    UpdateTalukaService,
} from '@generated-crud/taluka/update_taluka.api';
import {
    UpdateTeamMemberController,
    UpdateTeamMemberService,
} from '@generated-crud/team_member/update_team_member.api';
import {
    UpdateTraineeController,
    UpdateTraineeService,
} from '@generated-crud/trainee/update_trainee.api';
import {
    UpdateTraineeDocumentController,
    UpdateTraineeDocumentService,
} from '@generated-crud/trainee_document/update_trainee_document.api';
import {
    UpdateTrainerController,
    UpdateTrainerService,
} from '@generated-crud/trainer/update_trainer.api';
import {
    UpdateTrainerDocumentController,
    UpdateTrainerDocumentService,
} from '@generated-crud/trainer_document/update_trainer_document.api';
import {
    UpdateTrainingAssignmentController,
    UpdateTrainingAssignmentService,
} from '@generated-crud/training_assignment/update_training_assignment.api';
import {
    UpdateTrainingCentreChecklistController,
    UpdateTrainingCentreChecklistService,
} from '@generated-crud/training_centre_checklist/update_training_centre_checklist.api';
import {
    UpdateTrainingCentreController,
    UpdateTrainingCentreService,
} from '@generated-crud/training_centre/update_training_centre.api';
import {
    UpdateTrainingCentreDocumentController,
    UpdateTrainingCentreDocumentService,
} from '@generated-crud/training_centre_document/update_training_centre_document.api';
import {
    UpdateTrainingDayController,
    UpdateTrainingDayService,
} from '@generated-crud/training_day/update_training_day.api';
import {
    UpdateWageCompensationController,
    UpdateWageCompensationService,
} from '@generated-crud/wage_compensation/update_wage_compensation.api';
import {
    ViewAssessmentController,
    ViewAssessmentService,
} from '@generated-crud/assessment/view_assessment.api';
import {
    ViewAssessmentResultController,
    ViewAssessmentResultService,
} from '@generated-crud/assessment_result/view_assessment_result.api';
import {
    ViewAssignmentTargetController,
    ViewAssignmentTargetService,
} from '@generated-crud/assignment_target/view_assignment_target.api';
import {
    ViewAttendanceController,
    ViewAttendanceService,
} from '@generated-crud/attendance/view_attendance.api';
import {
    ViewBatchApprovalController,
    ViewBatchApprovalService,
} from '@generated-crud/batch_approval/view_batch_approval.api';
import {
    ViewBatchController,
    ViewBatchService,
} from '@generated-crud/batch/view_batch.api';
import {
    ViewBatchTraineeController,
    ViewBatchTraineeService,
} from '@generated-crud/batch_trainee/view_batch_trainee.api';
import {
    ViewCertificateController,
    ViewCertificateService,
} from '@generated-crud/certificate/view_certificate.api';
import {
    ViewCurriculumController,
    ViewCurriculumService,
} from '@generated-crud/curriculum/view_curriculum.api';
import {
    ViewDistrictController,
    ViewDistrictService,
} from '@generated-crud/district/view_district.api';
import {
    ViewDivisionController,
    ViewDivisionService,
} from '@generated-crud/division/view_division.api';
import {
    ViewJobRoleController,
    ViewJobRoleService,
} from '@generated-crud/job_role/view_job_role.api';
import {
    ViewLoiController,
    ViewLoiService,
} from '@generated-crud/loi/view_loi.api';
import {
    ViewOrganisationController,
    ViewOrganisationService,
} from '@generated-crud/organisation/view_organisation.api';
import {
    ViewPreScreeningController,
    ViewPreScreeningService,
} from '@generated-crud/pre_screening/view_pre_screening.api';
import {
    ViewStaffController,
    ViewStaffService,
} from '@generated-crud/staff/view_staff.api';
import {
    ViewStateController,
    ViewStateService,
} from '@generated-crud/state/view_state.api';
import {
    ViewTalukaController,
    ViewTalukaService,
} from '@generated-crud/taluka/view_taluka.api';
import {
    ViewTeamMemberController,
    ViewTeamMemberService,
} from '@generated-crud/team_member/view_team_member.api';
import {
    ViewTraineeController,
    ViewTraineeService,
} from '@generated-crud/trainee/view_trainee.api';
import {
    ViewTraineeDocumentController,
    ViewTraineeDocumentService,
} from '@generated-crud/trainee_document/view_trainee_document.api';
import {
    ViewTrainerController,
    ViewTrainerService,
} from '@generated-crud/trainer/view_trainer.api';
import {
    ViewTrainerDocumentController,
    ViewTrainerDocumentService,
} from '@generated-crud/trainer_document/view_trainer_document.api';
import {
    ViewTrainingAssignmentController,
    ViewTrainingAssignmentService,
} from '@generated-crud/training_assignment/view_training_assignment.api';
import {
    ViewTrainingCentreChecklistController,
    ViewTrainingCentreChecklistService,
} from '@generated-crud/training_centre_checklist/view_training_centre_checklist.api';
import {
    ViewTrainingCentreController,
    ViewTrainingCentreService,
} from '@generated-crud/training_centre/view_training_centre.api';
import {
    ViewTrainingCentreDocumentController,
    ViewTrainingCentreDocumentService,
} from '@generated-crud/training_centre_document/view_training_centre_document.api';
import {
    ViewTrainingDayController,
    ViewTrainingDayService,
} from '@generated-crud/training_day/view_training_day.api';
import {
    ViewWageCompensationController,
    ViewWageCompensationService,
} from '@generated-crud/wage_compensation/view_wage_compensation.api';

@Module({
    controllers: [
        CreateAssessmentController,
        CreateAssessmentResultController,
        CreateAssignmentTargetController,
        CreateAttendanceController,
        CreateBatchApprovalController,
        CreateBatchController,
        CreateBatchTraineeController,
        CreateCertificateController,
        CreateCurriculumController,
        CreateDistrictController,
        CreateDivisionController,
        CreateJobRoleController,
        CreateLoiController,
        CreateOrganisationController,
        CreatePreScreeningController,
        CreateStaffController,
        CreateStateController,
        CreateTalukaController,
        CreateTeamMemberController,
        CreateTraineeController,
        CreateTraineeDocumentController,
        CreateTrainerController,
        CreateTrainerDocumentController,
        CreateTrainingAssignmentController,
        CreateTrainingCentreChecklistController,
        CreateTrainingCentreController,
        CreateTrainingCentreDocumentController,
        CreateTrainingDayController,
        CreateWageCompensationController,
        DeleteAssessmentController,
        DeleteAssessmentResultController,
        DeleteAssignmentTargetController,
        DeleteAttendanceController,
        DeleteBatchApprovalController,
        DeleteBatchController,
        DeleteBatchTraineeController,
        DeleteCertificateController,
        DeleteCurriculumController,
        DeleteDistrictController,
        DeleteDivisionController,
        DeleteJobRoleController,
        DeleteLoiController,
        DeleteOrganisationController,
        DeletePreScreeningController,
        DeleteStaffController,
        DeleteStateController,
        DeleteTalukaController,
        DeleteTeamMemberController,
        DeleteTraineeController,
        DeleteTraineeDocumentController,
        DeleteTrainerController,
        DeleteTrainerDocumentController,
        DeleteTrainingAssignmentController,
        DeleteTrainingCentreChecklistController,
        DeleteTrainingCentreController,
        DeleteTrainingCentreDocumentController,
        DeleteTrainingDayController,
        DeleteWageCompensationController,
        ListAssessmentController,
        ListAssessmentResultController,
        ListAssignmentTargetController,
        ListAttendanceController,
        ListBatchApprovalController,
        ListBatchController,
        ListBatchTraineeController,
        ListCertificateController,
        ListCurriculumController,
        ListDistrictController,
        ListDivisionController,
        ListJobRoleController,
        ListLoiController,
        ListOrganisationController,
        ListPreScreeningController,
        ListStaffController,
        ListStateController,
        ListTalukaController,
        ListTeamMemberController,
        ListTraineeController,
        ListTraineeDocumentController,
        ListTrainerController,
        ListTrainerDocumentController,
        ListTrainingAssignmentController,
        ListTrainingCentreChecklistController,
        ListTrainingCentreController,
        ListTrainingCentreDocumentController,
        ListTrainingDayController,
        ListWageCompensationController,
        UpdateAssessmentController,
        UpdateAssessmentResultController,
        UpdateAssignmentTargetController,
        UpdateAttendanceController,
        UpdateBatchApprovalController,
        UpdateBatchController,
        UpdateBatchTraineeController,
        UpdateCertificateController,
        UpdateCurriculumController,
        UpdateDistrictController,
        UpdateDivisionController,
        UpdateJobRoleController,
        UpdateLoiController,
        UpdateOrganisationController,
        UpdatePreScreeningController,
        UpdateStaffController,
        UpdateStateController,
        UpdateTalukaController,
        UpdateTeamMemberController,
        UpdateTraineeController,
        UpdateTraineeDocumentController,
        UpdateTrainerController,
        UpdateTrainerDocumentController,
        UpdateTrainingAssignmentController,
        UpdateTrainingCentreChecklistController,
        UpdateTrainingCentreController,
        UpdateTrainingCentreDocumentController,
        UpdateTrainingDayController,
        UpdateWageCompensationController,
        ViewAssessmentController,
        ViewAssessmentResultController,
        ViewAssignmentTargetController,
        ViewAttendanceController,
        ViewBatchApprovalController,
        ViewBatchController,
        ViewBatchTraineeController,
        ViewCertificateController,
        ViewCurriculumController,
        ViewDistrictController,
        ViewDivisionController,
        ViewJobRoleController,
        ViewLoiController,
        ViewOrganisationController,
        ViewPreScreeningController,
        ViewStaffController,
        ViewStateController,
        ViewTalukaController,
        ViewTeamMemberController,
        ViewTraineeController,
        ViewTraineeDocumentController,
        ViewTrainerController,
        ViewTrainerDocumentController,
        ViewTrainingAssignmentController,
        ViewTrainingCentreChecklistController,
        ViewTrainingCentreController,
        ViewTrainingCentreDocumentController,
        ViewTrainingDayController,
        ViewWageCompensationController,
    ],
    providers: [
        CreateAssessmentService,
        CreateAssessmentResultService,
        CreateAssignmentTargetService,
        CreateAttendanceService,
        CreateBatchApprovalService,
        CreateBatchService,
        CreateBatchTraineeService,
        CreateCertificateService,
        CreateCurriculumService,
        CreateDistrictService,
        CreateDivisionService,
        CreateJobRoleService,
        CreateLoiService,
        CreateOrganisationService,
        CreatePreScreeningService,
        CreateStaffService,
        CreateStateService,
        CreateTalukaService,
        CreateTeamMemberService,
        CreateTraineeService,
        CreateTraineeDocumentService,
        CreateTrainerService,
        CreateTrainerDocumentService,
        CreateTrainingAssignmentService,
        CreateTrainingCentreChecklistService,
        CreateTrainingCentreService,
        CreateTrainingCentreDocumentService,
        CreateTrainingDayService,
        CreateWageCompensationService,
        DeleteAssessmentService,
        DeleteAssessmentResultService,
        DeleteAssignmentTargetService,
        DeleteAttendanceService,
        DeleteBatchApprovalService,
        DeleteBatchService,
        DeleteBatchTraineeService,
        DeleteCertificateService,
        DeleteCurriculumService,
        DeleteDistrictService,
        DeleteDivisionService,
        DeleteJobRoleService,
        DeleteLoiService,
        DeleteOrganisationService,
        DeletePreScreeningService,
        DeleteStaffService,
        DeleteStateService,
        DeleteTalukaService,
        DeleteTeamMemberService,
        DeleteTraineeService,
        DeleteTraineeDocumentService,
        DeleteTrainerService,
        DeleteTrainerDocumentService,
        DeleteTrainingAssignmentService,
        DeleteTrainingCentreChecklistService,
        DeleteTrainingCentreService,
        DeleteTrainingCentreDocumentService,
        DeleteTrainingDayService,
        DeleteWageCompensationService,
        ListAssessmentService,
        ListAssessmentResultService,
        ListAssignmentTargetService,
        ListAttendanceService,
        ListBatchApprovalService,
        ListBatchService,
        ListBatchTraineeService,
        ListCertificateService,
        ListCurriculumService,
        ListDistrictService,
        ListDivisionService,
        ListJobRoleService,
        ListLoiService,
        ListOrganisationService,
        ListPreScreeningService,
        ListStaffService,
        ListStateService,
        ListTalukaService,
        ListTeamMemberService,
        ListTraineeService,
        ListTraineeDocumentService,
        ListTrainerService,
        ListTrainerDocumentService,
        ListTrainingAssignmentService,
        ListTrainingCentreChecklistService,
        ListTrainingCentreService,
        ListTrainingCentreDocumentService,
        ListTrainingDayService,
        ListWageCompensationService,
        UpdateAssessmentService,
        UpdateAssessmentResultService,
        UpdateAssignmentTargetService,
        UpdateAttendanceService,
        UpdateBatchApprovalService,
        UpdateBatchService,
        UpdateBatchTraineeService,
        UpdateCertificateService,
        UpdateCurriculumService,
        UpdateDistrictService,
        UpdateDivisionService,
        UpdateJobRoleService,
        UpdateLoiService,
        UpdateOrganisationService,
        UpdatePreScreeningService,
        UpdateStaffService,
        UpdateStateService,
        UpdateTalukaService,
        UpdateTeamMemberService,
        UpdateTraineeService,
        UpdateTraineeDocumentService,
        UpdateTrainerService,
        UpdateTrainerDocumentService,
        UpdateTrainingAssignmentService,
        UpdateTrainingCentreChecklistService,
        UpdateTrainingCentreService,
        UpdateTrainingCentreDocumentService,
        UpdateTrainingDayService,
        UpdateWageCompensationService,
        ViewAssessmentService,
        ViewAssessmentResultService,
        ViewAssignmentTargetService,
        ViewAttendanceService,
        ViewBatchApprovalService,
        ViewBatchService,
        ViewBatchTraineeService,
        ViewCertificateService,
        ViewCurriculumService,
        ViewDistrictService,
        ViewDivisionService,
        ViewJobRoleService,
        ViewLoiService,
        ViewOrganisationService,
        ViewPreScreeningService,
        ViewStaffService,
        ViewStateService,
        ViewTalukaService,
        ViewTeamMemberService,
        ViewTraineeService,
        ViewTraineeDocumentService,
        ViewTrainerService,
        ViewTrainerDocumentService,
        ViewTrainingAssignmentService,
        ViewTrainingCentreChecklistService,
        ViewTrainingCentreService,
        ViewTrainingCentreDocumentService,
        ViewTrainingDayService,
        ViewWageCompensationService,
    ],
})
export class GeneratedCrudApiModule {}
