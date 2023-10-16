import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryGroupComponent } from './category-group.component';

const routes: Routes = [
  {
    path:'',
    component:CategoryGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryGroupRoutingModule { }
