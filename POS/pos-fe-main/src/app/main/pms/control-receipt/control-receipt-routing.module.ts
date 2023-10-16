import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlReceiptComponent } from './control-receipt.component';
import { DebtComponent } from './debt/debt.component';
import { ModalCreateEditControlReceiptComponent } from './modal-create-edit-control-receipt/modal-create-edit-control-receipt.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'receipt',
        component: ControlReceiptComponent
      },
      {
        path: 'debt',
        component: DebtComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'control-receipt-edit-create',
        component: ModalCreateEditControlReceiptComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlReceiptRoutingModule { }
