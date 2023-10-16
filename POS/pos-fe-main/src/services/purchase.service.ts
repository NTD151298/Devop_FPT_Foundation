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
export class PurchaseService {

  constructor(
    public http: HttpClient,
    private dataService: DataService,
    private config: Configuration,
  ) { }

  public getPurchaseList(data): Observable<any> {
    return this.dataService.post(`${this.config.ApiUrl}purchase/list`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getPurchase(id): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}purchase/detail?id=${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public createPurchase(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}purchase/create`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public modifyPurchase(data: any) {
    return this.dataService.post(`${this.config.ApiUrl}purchase/modify`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public deletePurchase(id: any) {
    return this.dataService.delete(`${this.config.ApiUrl}purchase/delete?id=`, id).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }

  public getListForReview(supplier_id: number): Observable<any> {
    return this.dataService.get(`${this.config.ApiUrl}purchase/list-for-review?supplier_id=${supplier_id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error Code: ${error.status}\nMessage: ${error.message}`);
      }),
    )
  }
}
