import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from '../services';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptorService {
  public loaderType: number = 1;
  public requestLogs: any[] = [];
  constructor(
    private loaderService: LoaderService,
    public snackBar: MatSnackBar
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqModified = req.clone({
      reportProgress: true
    });
    this.chooseAndShowLoader(reqModified);
    return next.handle(reqModified)
    .pipe(
      tap(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.DownloadProgress:
              break;
            case HttpEventType.Response:
              this.hideLoader(event);
              break;
            case HttpEventType.User:
              break;
            default:
          }
        },
        (err: any) => {
          this.hideLoader(err);
        }
      )
    );
  }
  private chooseAndShowLoader(reqModified: HttpRequest<any>) {
    let loaderType = '0';
    if (reqModified.body) {
      loaderType = (reqModified.body instanceof FormData) ? reqModified.body.get('loader') : reqModified.body.loader;
      if ((reqModified.body instanceof FormData) && reqModified.body.get('loader')) {
        reqModified.body.delete('loader');
      } else if ((reqModified.body instanceof Object) && reqModified.body.loader) {
        delete reqModified.body.loader;
      }
    } else {
      loaderType = '2';
    }
    this.chooseLoader(loaderType, reqModified);
  }

  private chooseLoader(loaderType: string, reqModified: HttpRequest<any>) {
    if (loaderType !== '0') {
      if (!this.requestLogs.length) {
        this.loaderService.showFullScreenLoader();
      }
      const reqData = {method: reqModified.method, url: reqModified.urlWithParams, loader: '2'};
      this.requestLogs.push(reqData);
    }
  }
  private hideLoader(event: any) {
    const closedReqIndex = this.requestLogs.findIndex(item => item.url === event.url);
    this.requestLogs.splice(closedReqIndex, 1);
    if (
      !this.requestLogs.length
    ) {
      this.loaderService.hideFullScreenLoader();
    }
  }
}
