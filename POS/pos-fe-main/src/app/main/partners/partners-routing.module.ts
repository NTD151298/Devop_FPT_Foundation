import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { ProductEditComponent } from '../products/product-edit/product-edit.component';
import { PartnerDetailComponent } from './partner-detail/partner-detail.component';
import { PartnerListComponent } from './partner-list/partner-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: PartnerListComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYDOITAC',
    },
  },
  {
    path: 'detail/:id',
    component: PartnerDetailComponent,
    canActivate: [AuthGuard],
    data: {
      code: 'QUANLYDOITAC',
    },
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule { }
