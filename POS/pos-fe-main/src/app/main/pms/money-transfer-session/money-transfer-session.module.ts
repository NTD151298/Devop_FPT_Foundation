import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoneyTransferSessionRoutingModule } from './money-transfer-session-routing.module';
import { MoneyTransferSessionComponent } from './money-transfer-session.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalPurchaseDetailComponent } from './modal-purchase-detail/modal-purchase-detail.component';
import { ModalCreateModifyMoneyTransferSessionComponent } from './modal-create-modify-money-transfer-session/modal-create-modify-money-transfer-session.component';


@NgModule({
  declarations: [
    MoneyTransferSessionComponent,
    ModalPurchaseDetailComponent,
    ModalCreateModifyMoneyTransferSessionComponent
  ],
  imports: [
    CommonModule,
    MoneyTransferSessionRoutingModule,      
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MoneyTransferSessionModule { }
