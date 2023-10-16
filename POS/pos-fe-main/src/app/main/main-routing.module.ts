import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { PurchareComponent } from './purchare/purchare.component';
import { PurchaseDetailComponent } from './purchare/purchase-detail/purchase-detail.component';
import { RefundOrderDetailComponent } from './refund/refund-order-detail/refund-order-detail.component';
import { RefundOrderListComponent } from './refund/refund-order-list/refund-order-list.component';
import { SaleSessionListComponent } from './sales/sale-session-list/sale-session-list.component';
import { SaleSessionStartModalComponent } from './sales/sale-session-start-modal/sale-session-start-modal.component';
import { VoucherDetailComponent } from './voucher/voucher-detail/voucher-detail.component';
import { VoucherListComponent } from './voucher/voucher-list/voucher-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: '/main/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          code: '',
        },
      },
      {
        path: 'voucher',
        component: VoucherListComponent,
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIEUGIAMGIA',
        },
      },
      {
        path: 'voucher/detail/:id',
        component: VoucherDetailComponent,
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIEUGIAMGIA',
        },
      },
      {
        path: 'sale-session',
        component: SaleSessionListComponent,
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIENBANHANG',
        },
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYNGUOIDUNG',
        },
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'category-product',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYDANHMUC',
        },
        loadChildren: () =>
          import('./catalog/category-product/category-product.module').then(
            (m) => m.CategoryProductModule
          ),
      },
      {
        path: 'category-stalls',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYDANHMUC',
        },
        loadChildren: () =>
          import('./catalog/category-stalls/category-stalls.module').then((m) => m.CategoryStallsModule),
      },
      {
        path: 'category-group',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYDANHMUC',
        },
        loadChildren: () =>
          import('./catalog/category-group/category-group.module').then((m) => m.CategoryGroupModule),
      },
      {
        path: 'category-packing',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYDANHMUC',
        },
        loadChildren: () =>
          import('./catalog/category-packing/category-packing.module').then(
            (m) => m.CategoryPackingModule
          ),
      },
      {
        path: 'category-units',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYDANHMUC',
        },
        loadChildren: () =>
          import('./catalog/category-units/category-units.module').then(
            (m) => m.CategoryUnitsModule
          ),
      },
      {
        path: 'purchase',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIEUMUAHANG',
        },
        component: PurchareComponent,
      },
      {
        path: 'sheft',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIENBANHANG',
        },
        component: SaleSessionStartModalComponent,
      },
      {
        path: 'purchase/detail/:id/:wh_id/:isReadOnly',
        component: PurchaseDetailComponent,
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIEUMUAHANG',
        },
      },
      {
        path: 'refund/detail/:id',
        component: RefundOrderDetailComponent,
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYHOANHANG',
        },
      },
      {
        path: 'refund',
        component: RefundOrderListComponent,
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYHOANHANG',
        },
      },
      {
        path: 'warehouses',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYKHO',
        },
        loadChildren: () =>
          import('./warehouses/warehouses.module').then(
            (m) => m.WarehousesModule
          ),
      },
      {
        path: 'products',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYSANPHAM',
        },
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
      },
      { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
      { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
      { path: 'partners', loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule) },
      {
        path: 'report',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYBAOCAO',
        },
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'promotion',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYBAOCAO',
        },
        loadChildren: () =>
          import('./promotion/promotion.module').then((m) => m.PromotionModule),
      },
      {
        path: 'contract',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYHOPDONG',
        },
        loadChildren: () =>
          import('./pms/contract/contract.module').then(
            (m) => m.ContractModule
          ),
      },
      {
        path: 'money-transfer-session',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYPHIENCHUYENTIEN',
        },
        loadChildren: () =>
          import(
            './pms/money-transfer-session/money-transfer-session.module'
          ).then((m) => m.MoneyTransferSessionModule),
      },
      {
        path: 'control',
        canActivate: [AuthGuard],
        data: {
          code: 'QUANLYDOISOAT',
        },
        loadChildren: () =>
          import('./pms/control-receipt/control-receipt.module').then(
            (m) => m.ControlReceiptModule
          ),
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
