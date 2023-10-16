import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, finalize, Observable, of, retry, throwError } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenService: AuthenticationService,
    private spinner: NgxSpinnerService
  ) {}
  private _inProgressCount = 0;

  private handleAuthError(err: any): Observable<any> {
    if (err.status === 401 || err.status === 403 || err.status === 0) {
      this.authenService.logout();
      return of(err.message);
    }
    return throwError(err);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (this._inProgressCount <= 0) {
      this.spinner.show();
    }
    this._inProgressCount++;
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authenService.currentTokenValue}`,
      },
    });
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }
    return next.handle(request).pipe(
      finalize(() => {
        this._inProgressCount--;
        if (this._inProgressCount === 0) {
          this.spinner.hide();
        }
      }),
      catchError(x => this.handleAuthError(x))
    );
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
];
