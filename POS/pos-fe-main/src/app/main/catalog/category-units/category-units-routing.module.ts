import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryUnitsComponent } from './category-units.component';

const routes: Routes = [
  {
    path:'',
    component:CategoryUnitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryUnitsRoutingModule { }
