import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYDONHANG',
    },
  },
  {
    path: 'detail/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYDONHANG',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
