import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { LoginGuard } from 'src/services/auth/login.guard';
import { LoginComponent } from './login/login.component';
import { ListBarcodeComponent } from './pos/barcode/list-barcode/list-barcode.component';
import { PosComponent } from './pos/pos.component';

const routes: Routes = [
  { path: '', redirectTo: '/main/dashboard', pathMatch: 'full' },
  { path: 'list-barcode', component: ListBarcodeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'pos/:wh/:id', component: PosComponent },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
