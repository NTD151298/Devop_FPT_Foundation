import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { validVariable } from '../common/globalfunction';
import { Configuration } from '../common/configuration';
import { POSServices } from '../pos/pos.service';
import { UserService } from '../pos/user.service';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentTokenSub: BehaviorSubject<any>;
  public currentToken: Observable<any>;
  public userInfoSub: BehaviorSubject<any>;
  public userInfo: Observable<any>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private config: Configuration,
    private userService: UserService
  ) {
    this.currentTokenSub = new BehaviorSubject<any>(
      localStorage.getItem('currentToken')
    );
    this.currentToken = this.currentTokenSub.asObservable();
    this.userInfoSub = new BehaviorSubject<any>(
      localStorage.getItem('userInfo')
    );
    this.userInfo = this.userInfoSub.asObservable();
  }
  public get currentTokenValue(): any {
    let token;
    if (validVariable(this.currentTokenSub.value)) {
      token = this.currentTokenSub.value;
    } else {
      token = false;
    }
    return token;
  }
  public get currentUserInfoValue(): any {
    let userInfo;
    if (validVariable(this.userInfoSub.value)) {
      userInfo = JSON.parse(this.userInfoSub.value);
    } else {
      userInfo = {};
    }
    return userInfo;
  }
  public get currentUserWarehouseId(): any {
    return validVariable(this.currentUserInfoValue.warehouse?.id)
      ? this.currentUserInfoValue.warehouse.id
      : null;
  }
  public get currentUserName(): any {
    return this.currentUserInfoValue.full_name;
  }

  checkToken() {
    return validVariable(this.currentTokenSub.value);
  }

  login(dataAuthen: {
    UserName: any;
    Password: any;
    RememberMe: any;
  }): Observable<boolean> {
    return this.http
      .post(`${this.config.ApiUrl}admin/admin-login`, {
        username: dataAuthen.UserName,
        password: dataAuthen.Password,
      })
      .pipe(
        map(({ data }: any) => {
          if (data) {
            if (validVariable(data.token)) {
              if (data.RememberMe) {
                localStorage.setItem('loginData', data);
              }
              localStorage.setItem('userInfo', JSON.stringify(data));
              localStorage.setItem('full_name', data.full_name);
              localStorage.setItem('username', data.username);
              localStorage.setItem('currentToken', data.token);
              this.currentTokenSub.next(data.token);
              this.userInfoSub.next(JSON.stringify(data));
              forkJoin([
                this.userService.adminGroupListUrl(),
                this.userService.adminGroupUserListUrl(data.id),
              ]).subscribe(([groupList, userGroupList]) => {
                userGroupList.data.forEach((ele) => {
                  groupList.data.forEach((obj) => {
                    if (
                      ele.group_id == obj.id &&
                      (obj.name.toLowerCase() == 'admin' ||
                        obj.name.toLowerCase() == 'nhóm quản lý')
                    ) {
                      localStorage.setItem('roleName', 'admin');
                    }
                  });
                });
              });
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
      );
  }
  public logout() {
    this.clearStorage();
    this.router.navigate(['/login']);
    return true;
  }
  public clearStorage() {
    (window as any).autoLogin = false;
    localStorage.removeItem('currentToken');
    localStorage.removeItem('full_name');
    localStorage.removeItem('username');
    localStorage.getItem('roleName') && localStorage.removeItem('roleName');
    localStorage.removeItem('userInfo');
    this.currentTokenSub.next(null);
    this.userInfoSub.next(null);
    return true;
  }
}
