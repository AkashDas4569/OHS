import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, Subject, timer } from 'rxjs';
import { catchError, map, tap, switchMap, retry } from 'rxjs/operators';
// Handle error
import { HandleError, HandleErrorService } from './handle-error.service';
// Server Link
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
// Content Type
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class OhsClientService {
  private handleError: HandleError;
  public apiUrl = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private router: Router
  ) {
    this.handleError = handleErrorService.createHandleError('OhsClientService');
  }

  getAllClientList(data: object) {
    const apiPath = `${this.apiUrl}/ClientOHSModule/GetAllClient`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAllClientList'))
      );
  }
  getClientById(data: object) {
    const apiPath = `${this.apiUrl}/ClientOHSModule/GetClientById`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getClientById'))
      );
  }
  addEditOhsClientModule(data: object) {
    const apiPath = `${this.apiUrl}/ClientOHSModule/AddEditClient`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addEditOhsClientModule'))
      );
  }
  deleteOhsClientModule(data: object) {
    const apiPath = `${this.apiUrl}/ClientOHSModule/DeleteClient`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('deleteOhsClientModule'))
      );
  }
  
}