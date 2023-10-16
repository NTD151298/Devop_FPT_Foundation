import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoneyTransferSessionComponent } from './money-transfer-session.component';
import { ModalPurchaseDetailComponent } from './modal-purchase-detail/modal-purchase-detail.component';

const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: '',
          component: MoneyTransferSessionComponent,
        },  
        {
          path: 'modal-purchase-detail',
          component: ModalPurchaseDetailComponent,
        },    
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoneyTransferSessionRoutingModule { }
