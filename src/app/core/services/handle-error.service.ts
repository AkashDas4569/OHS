import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';

// import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {
  constructor(
    // private messageService: MessageService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  /** Create curried handleError function that already knows the service name */
  createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

    return (httpErrorResponse: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.log(httpErrorResponse.message); // log to console instead

      const message = (httpErrorResponse.error instanceof ErrorEvent) ?
        httpErrorResponse.message :
       `server returned code ${httpErrorResponse.status} with body "${httpErrorResponse.error}"`;

      // TODO: better job of transforming error for user consumption
      // this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);
      console.log(httpErrorResponse);
      if (httpErrorResponse.status === 401) {
        // localStorage.clear();
        // this.router.navigate(['/login']);
        // this.snackBar.open('Your Session has been expired. Please login again.', 'Close', {
        //   panelClass: 'error-popup',
        // });
      } else if (httpErrorResponse.status === 500 || !httpErrorResponse.error.result) {
        // this.snackBar.open('Something went wrong! Please try again.', 'Close', {
        //   panelClass: 'error-popup',
        // });
        this.snackBar.open(`
          The application has encountered an unknown error.
          Our technical staff will be looking into this with the utmost urgency.`
          , 'Close', {
          panelClass: 'error-popup',
        });
      } else {
        this.snackBar.open(httpErrorResponse.error.result.msg, 'Close', {
          panelClass: 'error-popup',
        });
      }
      // Let the app keep running by returning a safe result.
      return of( result );
    };

  }
}
