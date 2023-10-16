import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { validVariable } from '../common/globalfunction';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }
  // localStorage.setItem('userInfo',JSON.stringify(data))

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    let token = localStorage.getItem('currentToken');

    if (!token) {
      this.toastr.error('Vui lòng đăng nhập!')
      this.router.navigate(['/login'])
      return of(false)
    } else {
      let authentication = JSON.parse(localStorage.getItem('userInfo'))['roles'];
      if(authentication && authentication.length>0){
        if (authentication.find(ele => {
          if(ele.role){
            return ele.role.includes(route.data['code'])
          }else{
            this.authenticationService.logout();
          }
        })) {
          return of(true);
        } else {
          this.toastr.warning("Bạn không có quyền truy cập vào phần này!!! :((");
          this.router.navigate(['/main/dashboard']);
          return of(false);
        }
      }else{
        return of(false)
      }
    }
  }
}
