import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services';
// Server Link
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {
  constructor(
    public authenticationService: AuthenticationService,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const splittedLocation = window.location.href.split(/[\+\-:/. )(]/g);
    // console.log(splittedLocation);
    const reqModified = req.clone({
      params: req.params.set('subdomain', splittedLocation[3])
    });
    if (this.authenticationService.getToken()) {
      const authToken = this.authenticationService.getToken() as string;
      if (reqModified.body) {
        if (reqModified.body instanceof FormData) {
          reqModified.body.append('authkey', authToken);
        } else if (reqModified.body instanceof Object) {
          reqModified.body.authkey = authToken;
        }
      }
      // return next.handle(reqModified);
    }
    return next.handle(reqModified);
    // .pipe(
    //   map((event: HttpEvent<any>) => {
    //     if (event instanceof HttpResponse) {
    //       // Check Auth token if it is Valid else logout
    //       // if (!event.body.serverResponse.isSuccess && event.body.serverResponse.code === 601) {
    //       //   this.authenticationService.logOut();
    //       // }
    //     }
    //     return event;
    //   }),
    //   // catchError((error: any) => {
    //   //   return throwError(error);
    //   // })
    // );
  }
}
