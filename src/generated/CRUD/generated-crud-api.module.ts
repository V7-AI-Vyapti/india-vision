import { Module } from '@nestjs/common';
import {
    CreateDistrictController,
    CreateDistrictService,
} from '@generated-crud/district/create_district.api';
import {
    CreateDivisionController,
    CreateDivisionService,
} from '@generated-crud/division/create_division.api';
import {
    CreateOrganisationController,
    CreateOrganisationService,
} from '@generated-crud/organisation/create_organisation.api';
import {
    CreateStateController,
    CreateStateService,
} from '@generated-crud/state/create_state.api';
import {
    CreateTalukaController,
    CreateTalukaService,
} from '@generated-crud/taluka/create_taluka.api';
import {
    DeleteDistrictController,
    DeleteDistrictService,
} from '@generated-crud/district/delete_district.api';
import {
    DeleteDivisionController,
    DeleteDivisionService,
} from '@generated-crud/division/delete_division.api';
import {
    DeleteOrganisationController,
    DeleteOrganisationService,
} from '@generated-crud/organisation/delete_organisation.api';
import {
    DeleteStateController,
    DeleteStateService,
} from '@generated-crud/state/delete_state.api';
import {
    DeleteTalukaController,
    DeleteTalukaService,
} from '@generated-crud/taluka/delete_taluka.api';
import {
    ListDistrictController,
    ListDistrictService,
} from '@generated-crud/district/list_district.api';
import {
    ListDivisionController,
    ListDivisionService,
} from '@generated-crud/division/list_division.api';
import {
    ListOrganisationController,
    ListOrganisationService,
} from '@generated-crud/organisation/list_organisation.api';
import {
    ListStateController,
    ListStateService,
} from '@generated-crud/state/list_state.api';
import {
    ListTalukaController,
    ListTalukaService,
} from '@generated-crud/taluka/list_taluka.api';
import {
    UpdateDistrictController,
    UpdateDistrictService,
} from '@generated-crud/district/update_district.api';
import {
    UpdateDivisionController,
    UpdateDivisionService,
} from '@generated-crud/division/update_division.api';
import {
    UpdateOrganisationController,
    UpdateOrganisationService,
} from '@generated-crud/organisation/update_organisation.api';
import {
    UpdateStateController,
    UpdateStateService,
} from '@generated-crud/state/update_state.api';
import {
    UpdateTalukaController,
    UpdateTalukaService,
} from '@generated-crud/taluka/update_taluka.api';
import {
    ViewDistrictController,
    ViewDistrictService,
} from '@generated-crud/district/view_district.api';
import {
    ViewDivisionController,
    ViewDivisionService,
} from '@generated-crud/division/view_division.api';
import {
    ViewOrganisationController,
    ViewOrganisationService,
} from '@generated-crud/organisation/view_organisation.api';
import {
    ViewStateController,
    ViewStateService,
} from '@generated-crud/state/view_state.api';
import {
    ViewTalukaController,
    ViewTalukaService,
} from '@generated-crud/taluka/view_taluka.api';

@Module({
    controllers: [
        CreateDistrictController,
        CreateDivisionController,
        CreateOrganisationController,
        CreateStateController,
        CreateTalukaController,
        DeleteDistrictController,
        DeleteDivisionController,
        DeleteOrganisationController,
        DeleteStateController,
        DeleteTalukaController,
        ListDistrictController,
        ListDivisionController,
        ListOrganisationController,
        ListStateController,
        ListTalukaController,
        UpdateDistrictController,
        UpdateDivisionController,
        UpdateOrganisationController,
        UpdateStateController,
        UpdateTalukaController,
        ViewDistrictController,
        ViewDivisionController,
        ViewOrganisationController,
        ViewStateController,
        ViewTalukaController,
    ],
    providers: [
        CreateDistrictService,
        CreateDivisionService,
        CreateOrganisationService,
        CreateStateService,
        CreateTalukaService,
        DeleteDistrictService,
        DeleteDivisionService,
        DeleteOrganisationService,
        DeleteStateService,
        DeleteTalukaService,
        ListDistrictService,
        ListDivisionService,
        ListOrganisationService,
        ListStateService,
        ListTalukaService,
        UpdateDistrictService,
        UpdateDivisionService,
        UpdateOrganisationService,
        UpdateStateService,
        UpdateTalukaService,
        ViewDistrictService,
        ViewDivisionService,
        ViewOrganisationService,
        ViewStateService,
        ViewTalukaService,
    ],
})
export class GeneratedCrudApiModule {}
