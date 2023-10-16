import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryGroupRoutingModule } from './category-group-routing.module';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
import { CategoryGroupComponent } from './category-group.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [CategoryGroupComponent,
    ModalCreateEditComponent
  ],
  imports: [
    CommonModule,
    CategoryGroupRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
  ],
  providers: [NgbActiveModal]
})
export class CategoryGroupModule { }
