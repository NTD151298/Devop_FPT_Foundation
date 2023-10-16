import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/shared/services/data.service';
import { Configuration } from '../common/configuration';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  public getListUser(data): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-user-list`+ "?page_number=" + data.page_number + "&page_size=" + data.page_size + "&username=" + data.username + "&full_name=" + data.full_name).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getUserById(id: number) {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-user` + "?id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createUser(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-user-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifyUser(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-user-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public changePasswordUser(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-user-changepass`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupListUrl(): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-group-list`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupCreateUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-group-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupModifyUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-group-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupDeleteUrl(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}admin/admin-group-delete` + "?id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  // ======================end admin group=========================================
  public adminGroupUserListUrl(id: number): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-group-user-list` + "?user_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupUserListByGroupIdUrl(id: number): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-group-user-list-by-group-id` + "?group_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }


  public adminGroupUserCreateListUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-group-user-create-list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupUserModifyListUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-group-user-modify-list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminGroupUserDeleteUrl(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}admin/admin-group-user-delete` + "?id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  // ============================end adminGroupUser==============================
  public adminRoleListUrl(): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-role-list`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleCreateUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-role-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleModifyUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-role-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleDeleteUrl(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}admin/admin-role-delete` + "?id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
  // ============================end admin role ===================================
  public adminRoleGroupListUrl(id: number): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-role-group-list` + "?role_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleGroupListByGroupIdUrl(id: number): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-role-group-list-by-group-id` + "?group_id=" + id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleGroupCreateListUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-role-group-create-list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleGroupModifyListUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-role-group-modify-list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminRoleGroupDeleteUrl(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}admin/admin-role-group-delete` + "?id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  // ====================================================================================
  public adminUserWarehouseListUrl(user_id:number): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}admin/admin-user-warehouse-list?user_id=${user_id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminUserWarehouseCreateUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-user-warehouse-create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminUserWarehouseModifyUrl(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}admin/admin-user-warehouse-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public adminUserWarehouseDeleteUrl(id: number) {
    return this.dataService.delete(`${this.config.ApiUrl}admin/admin-user-warehouse-delete` + "?id=", id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
}


  // ============================end admin role group ===================================

