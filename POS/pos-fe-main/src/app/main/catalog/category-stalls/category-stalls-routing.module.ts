import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryStallsComponent } from './category-stalls.component';

const routes: Routes = [
  {
    path:'',
    component:CategoryStallsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryStallsRoutingModule { }
