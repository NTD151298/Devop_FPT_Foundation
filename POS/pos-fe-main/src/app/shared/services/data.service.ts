import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private baseUrl: string;
  constructor(private http: HttpClient) {
    // this.baseUrl = environment.apiUrl;
  }
  get(url: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers });
  }

  post(url: string, data?: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data, { headers });
  }
  put(url: string, data?: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(url, data, { headers });
  }
  delete(url: string, id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.delete(url + id, { headers });
  }
}
