import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { POSServices } from 'src/services/pos/pos.service';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Location } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from '../shared/shared.module';
import { SaleSessionListComponent } from './sales/sale-session-list/sale-session-list.component';
import { SaleSessionStartModalComponent } from './sales/sale-session-start-modal/sale-session-start-modal.component';
import { VoucherListComponent } from './voucher/voucher-list/voucher-list.component';
import { VoucherDetailComponent } from './voucher/voucher-detail/voucher-detail.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PurchareComponent } from './purchare/purchare.component';
import { PurchaseDetailComponent } from './purchare/purchase-detail/purchase-detail.component';
import { NgxPrintModule } from 'ngx-print';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';
import { RefundOrderListComponent } from './refund/refund-order-list/refund-order-list.component';
import { RefundOrderDetailComponent } from './refund/refund-order-detail/refund-order-detail.component';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    SaleSessionListComponent,
    SaleSessionStartModalComponent,
    VoucherListComponent,
    VoucherDetailComponent,
    PurchareComponent,
    PurchaseDetailComponent,
    RefundOrderListComponent,
    RefundOrderDetailComponent,

  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PanelMenuModule,
    ButtonModule,
    AvatarModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    CalendarModule,
    InputTextareaModule,
    TooltipModule,
    CheckboxModule,
    RadioButtonModule,
    SharedModule,
    NgxPrintModule,
    PaginatorModule,
    AutoCompleteModule,
    PaginationModule.forRoot(),
    ChartModule,
  ],
  providers: [POSServices, Location],
})
export class MainModule {}
