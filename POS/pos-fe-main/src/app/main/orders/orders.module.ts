import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxPrintModule } from 'ngx-print';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'primeng/api';
import { POSServices } from 'src/services/pos/pos.service';
import { OrderInvoidComponent } from './order-invoid/order-invoid.component';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderDetailComponent,
    OrderInvoidComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrdersRoutingModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    CalendarModule,
    InputTextareaModule,
    TooltipModule,
    CheckboxModule,
    RadioButtonModule,
    NgxPrintModule,
    PaginatorModule,
    AutoCompleteModule,
    PaginationModule.forRoot(),
    SharedModule,
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [POSServices, Location],
})
export class OrdersModule {}
