import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractComponent } from './contract.component';
import { ModalCreateContractComponent } from './modal-create-contract/modal-create-contract.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ContractComponent
      },
      {
        path: 'modal-create-contract',
        component: ModalCreateContractComponent
      },
      {
        path: 'modal-create-contract/:id',
        component: ModalCreateContractComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
