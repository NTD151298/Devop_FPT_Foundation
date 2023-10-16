import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Configuration } from './common/configuration';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  config = {
    ApiUrl: 'https://api-pms-dev.smartgap.vn/api/'
  }
  constructor(
    public http: HttpClient,
    private dataService: DataService
  ) { }

  public getSupplierList(data): Observable<any> {
    return this.dataService.post(`${this.config.ApiUrl}partner/list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getSupplier(id): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}partner/supplier?id=${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createSupplier(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}partner/create`, data).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifySupplier(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}partner/modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteSupplier(id: any) {
    return this.dataService.delete(`${this.config.ApiUrl}partner/delete?id=`, id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getSupplierReviewList(data): Observable<any> {
    return this.dataService.post(`${this.config.ApiUrl}partner/review-list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getSupplierReview(id): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}partner/review?id=${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createSupplierReview(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}partner/review-create`, data).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifySupplierReview(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}partner/review-modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deleteSupplierReviewDelete(id: any) {
    return this.dataService.delete(`${this.config.ApiUrl}partner/review-delete?id=`, id).pipe(
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
