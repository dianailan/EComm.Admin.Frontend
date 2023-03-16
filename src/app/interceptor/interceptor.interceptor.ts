import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { OpenSnackbarService } from "../services/open-snackbar.service";
import { IsLoadingService } from "../services/is-loading.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private openSnackBar: OpenSnackbarService,
    private isLoading: IsLoadingService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isLoading.loadingProcess(true);
    request = request.clone();
    return next.handle(request)
      .pipe(
        tap(n => {
          if (n instanceof HttpResponse && (n.url.includes("/api/") || n.url.includes("/account/"))) {
            this.isLoading.loadingProcess(false)
          }
        }),
        catchError((error) => {
          if (error.status === 401 || error.status === 0) {
            window.location.href = `Account/Login?returnUrl=${encodeURI(window.location.href)}`;
          } else if (error.status === 403) {
            this.openSnackBar.openSnackBarDanger('არ გაქვს მოქმედების განხორციელების უფლება');
          } else if (error.status === 500) {
            this.openSnackBar.openSnackBarDanger('დაფიქსირდა შეცდომა');
          }
          this.isLoading.loadingProcess(false);
          return throwError(error);
        }));
  }
}
