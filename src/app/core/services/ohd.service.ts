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

export class OhdService {

  private handleError: HandleError;
  public apiUrl = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private router: Router
  ) {
    this.handleError = handleErrorService.createHandleError('OhdService');
  }

  getAllUserRoles() {
    const apiPath = `${this.apiUrl}/AuthOHSModule/GetUserRole`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAllUserRoles'))
      );
  }
  getUserList(data: object) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/GetAllUser`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getUserList'))
      );
  }
  addEditUserModule(data: object) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/AddEditUser`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addEditUserModule'))
      );
  }
  deleteUserModule(data: object) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/DeleteUser`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('deleteUserModule'))
      );
  }
  getOhdList(data: object) {
    const apiPath = `${this.apiUrl}/OHDDoctorModule/GetAllDoctor`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getOhdList'))
      );
  }
  getOhdClinic(data: object) {
    const apiPath = `${this.apiUrl}/OHDDoctorModule/GetOHDClinic`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getOhdClinic'))
      );
  }
  addEditOhdModule(data: object) {
    const apiPath = `${this.apiUrl}/OHDDoctorModule/AddEditOHDDoctor`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addEditOhdModule'))
      );
  }
  deleteOhdModule(data: object) {
    const apiPath = `${this.apiUrl}/OHDDoctorModule/DeleteOHDDoctor`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('deleteOhdModule'))
      );
  }
  
}