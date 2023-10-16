import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { UserComponent } from './user/user.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ModalCreateEditComponent } from './user/modal-create-edit/modal-create-edit.component';

import { GroupComponent } from './group/group.component';
import { ModalCreateEditGroupComponent } from './group/modal-create-edit-group/modal-create-edit-group.component';

import { ModalCreateEditGroupRoleComponent } from './modal-create-edit-group-role/modal-create-edit-group-role.component';
import { ModalCreateEditRoleGroupComponent } from './modal-create-edit-role-group/modal-create-edit-role-group.component';
import { ModalCreateEditGroupUserComponent } from './modal-create-edit-group-user/modal-create-edit-group-user.component';

import { RoleComponent } from './role/role.component';
import { ModalCreateEditRoleComponent } from './role/modal-create-edit-role/modal-create-edit-role.component';
import { ModalCreateEditUserWarehouseComponent } from './user/modal-create-edit-user-warehouse/modal-create-edit-user-warehouse.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateModifyGroupRoleComponent } from './modal-create-modify-group-role/modal-create-modify-group-role.component';

@NgModule({
  declarations: [
    ModalCreateEditComponent,
    ModalCreateEditGroupComponent,
    ModalCreateEditRoleGroupComponent,
    UserComponent,
    GroupComponent,
    RoleComponent,
    ForgotPasswordComponent,
    ModalCreateEditRoleGroupComponent,
    ModalCreateEditGroupRoleComponent,
    ModalCreateEditGroupUserComponent,
    ModalCreateEditRoleComponent,
    ModalCreateEditUserWarehouseComponent,
    ModalCreateModifyGroupRoleComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    NgbDatepickerModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class UserModule { }
