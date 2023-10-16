import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxPrintModule } from 'ngx-print';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from 'primeng/api';
import { POSServices } from 'src/services/pos/pos.service';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomersRoutingModule,
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
export class CustomersModule {}
