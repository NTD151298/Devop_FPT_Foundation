import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { ProductComboDetailComponent } from './product-combo/product-combo-detail/product-combo-detail.component';
import { ProductComboListComponent } from './product-combo/product-combo-list/product-combo-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';
import { PriceHistoryListComponent } from './product-warehouse/price-history-list/price-history-list.component';
import { ProductBarcodePrintComponent } from './product-warehouse/product-barcode-print/product-barcode-print.component';
import { ProductDetailWarehouseListComponent } from './product-warehouse/product-detail-warehouse-list/product-detail-warehouse-list.component';
import { ProductWarehouseListComponent } from './product-warehouse/product-warehouse-list/product-warehouse-list.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'product/detail/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'product/edit/:id/:form_type',
    component: ProductEditComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'product-warehouse',
    component: ProductWarehouseListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'product-detail-warehouse',
    component: ProductDetailWarehouseListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'product-print-barcode',
    component: ProductBarcodePrintComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'history-change-price',
    component: PriceHistoryListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  },
  {
    path: 'product-combo',
    component: ProductComboListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  }, 
  {
    path: 'product-combo/product-combo-detail/:id',
    component: ProductComboDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYSANPHAM',
    },
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
