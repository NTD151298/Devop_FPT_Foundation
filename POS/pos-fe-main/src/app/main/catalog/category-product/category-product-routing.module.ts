import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryProductComponent } from './category-product.component';
const routes: Routes = [
  {
    path:'',
    component:CategoryProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryProductRoutingModule { }
