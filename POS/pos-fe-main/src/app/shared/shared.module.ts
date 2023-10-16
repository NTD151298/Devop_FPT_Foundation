import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// DIRECTIVES
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { HasRoleDirective } from './directive/has-role.directive';

@NgModule({
  exports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    NgSelectModule,
    ModalModule,
    ModalDialogModule,
    HasRoleDirective,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    OverlayModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    ModalDialogModule.forRoot(),
  ],
  declarations: [
    ConfirmDialogComponent,
    HasRoleDirective,
  ]
})
export class SharedModule { }

