import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractRoutingModule } from './contract-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonModule } from 'primeng/button';
import { ContractComponent } from './contract.component';
import { ModalCreateContractComponent } from './modal-create-contract/modal-create-contract.component';


@NgModule({
  declarations: [
    ContractComponent,
    ModalCreateContractComponent
  ],
  imports: [
    CommonModule,
    ContractRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    TabsModule,
    ButtonModule,
    InputTextareaModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class ContractModule { }
