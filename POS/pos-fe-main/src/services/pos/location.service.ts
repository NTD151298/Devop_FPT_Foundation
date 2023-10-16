import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { StorageService } from 'src/app/shared/services/storage.service'; 
import { DataService } from 'src/app/shared/services/data.service';
import { Configuration } from '../common/configuration'; 
@Injectable({
  providedIn: 'root'
})
export class LocationService {
    langPram: string = "vi";
    constructor(
        private router: Router,
        private dataService: DataService,
        private storeService: StorageService,
        private config: Configuration,
    ) {
        this.langPram = "?language_code=" + "vi";
    }

    // Get All provinces
    public GetProvices(): Observable<any> {
        return this.dataService.get(`${this.config.ApiUrl}category/category-province-list` + this.langPram).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }),
        )
    }

    // Get All District
    public GetDistricts(): Observable<any> {
        return this.dataService.get(`${this.config.ApiUrl}category/category-district-list`+ this.langPram).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }),
        )
    }

    // Get Districts by Province
    public GetDistrictsByProvince(province_id: any): Observable<any> {
        return this.dataService.get(`${this.config.ApiUrl}category/category-district-list-province` + this.langPram + '&province_id=' + province_id).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }),
        )
    }

    // Get All Wards
    public GetWatds(): Observable<any> {
        return this.dataService.get(`${this.config.ApiUrl}category/category-ward-list` + this.langPram).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }),
        )
    }

    // Get Wards by District
    public GetWatdsByDistrict(district_id: any): Observable<any> {
        return this.dataService.get(`${this.config.ApiUrl}category/category-ward-list-district` + this.langPram + '&district_id=' + district_id).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }),
        )
    }

    // Get All national
    public GetNationals(): Observable<any> {
        return this.dataService.get(`${this.config.ApiUrl}category/category-nation-list` + this.langPram).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                return of(`Error Code: ${error.status}\nMessage: ${error.message}`);
            }),
        )
    }
}
