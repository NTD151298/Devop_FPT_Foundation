import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { InOutDailyReportComponent } from './in-out-daily-report/in-out-daily-report.component';
import { InOutInventoryReportComponent } from './in-out-inventory-report/in-out-inventory-report.component';
import { InOutInventoryWarehouseReportComponent } from './in-out-inventory-warehouse-report/in-out-inventory-warehouse-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ReportProductsComponent } from './report-products/report-products.component';
import { RevenueBookReportComponent } from './revenue-book-report/revenue-book-report.component';
import { ShiftRevenueBookReportComponent } from './shift-revenue-book-report/shift-revenue-book-report.component';
const routes: Routes = [
  {
    path: 'product-revenue',
    component: ReportProductsComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  {
    path: 'profit',
    component: ProfitReportComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  {
    path: 'in-out-inventory-warehouse',
    component: InOutInventoryWarehouseReportComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  {
    path: 'in-out-inventory',
    component: InOutInventoryReportComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  {
    path: 'in-out-daily',
    component: InOutDailyReportComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  {
    path: 'revenue-book',
    component: RevenueBookReportComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  {
    path: 'shift-revenue-book',
    component: ShiftRevenueBookReportComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYBAOCAO',
    },
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
