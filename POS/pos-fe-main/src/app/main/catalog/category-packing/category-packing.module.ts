import { CategoryPackingComponent } from './category-packing.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryPackingRoutingModule } from './category-packing-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [ModalCreateEditComponent, CategoryPackingComponent],
  imports: [
    SharedModule,
    CommonModule,
    CategoryPackingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
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
export class CategoryPackingModule { }
