import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { WarehouseExportDetailComponent } from './warehouse-export/warehouse-export-detail/warehouse-export-detail.component';
import { WarehouseExportListComponent } from './warehouse-export/warehouse-export-list/warehouse-export-list.component';
import { WarehouseInventoryDetailComponent } from './warehouse-inventory/warehouse-inventory-detail/warehouse-inventory-detail.component';
import { WarehouseInventoryListComponent } from './warehouse-inventory/warehouse-inventory-list/warehouse-inventory-list.component';
import { WarehouseReceiptDetailComponent } from './warehouse-receipt/warehouse-receipt-detail/warehouse-receipt-detail.component';
import { WarehouseReceiptListComponent } from './warehouse-receipt/warehouse-receipt-list/warehouse-receipt-list.component';
import { WarehouseRequestDetailComponent } from './warehouse-request/warehouse-request-detail/warehouse-request-detail.component';
import { WarehouseRequestListComponent } from './warehouse-request/warehouse-request-list/warehouse-request-list.component';
import { WarehouseComponent } from './warehouse/warehouse.component';

const routes: Routes = [
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYKHO',
    },
    component: WarehouseComponent,
  },
  {
    path: 'warehouse-export',
    component: WarehouseExportListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYXUATKHO',
    },
  },
  {
    path: 'warehouse-export/detail/:type/:id',
    component: WarehouseExportDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYXUATKHO',
    },
  },
  {
    path: 'warehouse-export/detail/:type/:id/:warehouse_request_id',
    component: WarehouseExportDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYXUATKHO',
    },
  },
  {
    path: 'warehouse-inventory',
    component: WarehouseInventoryListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYTONKHO',
    },
  },
  {
    path: 'warehouse-inventory/detail/:id',
    component: WarehouseInventoryDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYTONKHO',
    },
  },
  {
    path: 'warehouse-receipt',
    component: WarehouseReceiptListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYNHAPKHO',
    },
  },
  {
    path: 'warehouse-receipt/detail/:id/:rq_id',
    component: WarehouseReceiptDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYNHAPKHO',
    },
  },
  {
    path: 'warehouse-request',
    component: WarehouseRequestListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYYEUCAUKHO',
    },
  },
  {
    path: 'warehouse-request/detail/:id',
    component: WarehouseRequestDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYYEUCAUKHO',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousesRoutingModule {}
