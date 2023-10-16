import { CategoryUnitsComponent } from './category-units.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryUnitsRoutingModule } from './category-units-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [CategoryUnitsComponent, ModalCreateEditComponent],
  imports: [
    SharedModule,
    CommonModule,
    CategoryUnitsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    PaginatorModule,
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
export class CategoryUnitsModule { }
