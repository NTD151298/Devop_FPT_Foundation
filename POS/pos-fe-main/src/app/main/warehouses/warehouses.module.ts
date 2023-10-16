import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ModalCreateModifyWarehouseComponent } from './warehouse/modal-create-modify-warehouse/modal-create-modify-warehouse.component';
import { WarehouseExportDetailComponent } from './warehouse-export/warehouse-export-detail/warehouse-export-detail.component';
import { WarehouseExportPrintComponent } from './warehouse-export/warehouse-export-print/warehouse-export-print.component';
import { WarehouseExportListComponent } from './warehouse-export/warehouse-export-list/warehouse-export-list.component';
import { WarehouseInventoryDetailComponent } from './warehouse-inventory/warehouse-inventory-detail/warehouse-inventory-detail.component';
import { WarehouseInventoryListComponent } from './warehouse-inventory/warehouse-inventory-list/warehouse-inventory-list.component';
import { WarehouseInventoryAddComponent } from './warehouse-inventory/warehouse-inventory-add/warehouse-inventory-add.component';
import { WarehouseReceiptPrintComponent } from './warehouse-receipt/warehouse-receipt-list/warehouse-receipt-print/warehouse-receipt-print.component';
import { WarehouseReceiptListComponent } from './warehouse-receipt/warehouse-receipt-list/warehouse-receipt-list.component';
import { WarehouseReceiptDetailComponent } from './warehouse-receipt/warehouse-receipt-detail/warehouse-receipt-detail.component';
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
import { POSServices } from 'src/services/pos/pos.service';
import { WarehouseRequestListComponent } from './warehouse-request/warehouse-request-list/warehouse-request-list.component';
import { WarehouseRequestDetailComponent } from './warehouse-request/warehouse-request-detail/warehouse-request-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HasRoleDirective } from 'src/app/shared/directive/has-role.directive';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    WarehouseComponent,
    ModalCreateModifyWarehouseComponent,
    WarehouseExportListComponent,
    WarehouseExportDetailComponent,
    WarehouseExportPrintComponent,
    WarehouseInventoryListComponent,
    WarehouseInventoryDetailComponent,
    WarehouseInventoryAddComponent,
    WarehouseReceiptPrintComponent,
    WarehouseReceiptListComponent,
    WarehouseReceiptDetailComponent,
    WarehouseRequestListComponent,
    WarehouseRequestDetailComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    WarehousesRoutingModule,
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
export class WarehousesModule {}
