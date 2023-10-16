import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYKHACHHANG',
    },
  },
  {
    path: 'detail/:id',
    component: CustomerDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYKHACHHANG',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
