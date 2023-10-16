import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlReceiptRoutingModule } from './control-receipt-routing.module';
import { ControlReceiptComponent } from './control-receipt.component';
import { DebtComponent } from './debt/debt.component';
import { PaymentComponent } from './payment/payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ModalCreateEditControlReceiptComponent } from './modal-create-edit-control-receipt/modal-create-edit-control-receipt.component';

@NgModule({
  declarations: [
    ControlReceiptComponent,
    DebtComponent,
    PaymentComponent,
    ModalCreateEditControlReceiptComponent
  ],
  imports: [
    CommonModule,
    ControlReceiptRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    PaginationModule.forRoot(),
    CheckboxModule,
    DropdownModule,
    TabViewModule,
  ]
})
export class ControlReceiptModule { }
