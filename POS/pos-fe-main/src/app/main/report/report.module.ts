import { NgModule } from '@angular/core';
import { CommonModule,Location } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportProductsComponent } from './report-products/report-products.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { InOutInventoryReportComponent } from './in-out-inventory-report/in-out-inventory-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxPrintModule } from 'ngx-print';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { POSServices } from 'src/services/pos/pos.service';
import { InOutInventoryWarehouseReportComponent } from './in-out-inventory-warehouse-report/in-out-inventory-warehouse-report.component';
import { InventoryHistoryReportComponent } from './in-out-inventory-report/inventory-history-report/inventory-history-report.component';
import { InOutDailyReportComponent } from './in-out-daily-report/in-out-daily-report.component';
import { RevenueBookReportComponent } from './revenue-book-report/revenue-book-report.component';
import { ShiftRevenueBookReportComponent } from './shift-revenue-book-report/shift-revenue-book-report.component';


@NgModule({
  declarations: [
    ReportProductsComponent,
    ProfitReportComponent,
    InOutInventoryReportComponent,
    InOutInventoryWarehouseReportComponent,
    InventoryHistoryReportComponent,
    InOutDailyReportComponent,
    RevenueBookReportComponent,
    ShiftRevenueBookReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    ReactiveFormsModule,
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
    SharedModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [POSServices, Location],
})
export class ReportModule { }
