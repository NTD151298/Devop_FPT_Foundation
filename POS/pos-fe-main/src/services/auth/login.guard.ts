import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { validVariable } from '../common/globalfunction';


@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private authen: AuthenticationService,
    private toastr: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    let token = this.authen.currentTokenValue;
    if (!token) {
      return of(true)
    } else {
      this.router.navigate(['/main/dashboard'])
      return of(false)
    }
  }
}
