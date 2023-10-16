import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryPackingComponent } from './category-packing.component';

const routes: Routes = [
  {
    path:'',
    component:CategoryPackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryPackingRoutingModule { }
