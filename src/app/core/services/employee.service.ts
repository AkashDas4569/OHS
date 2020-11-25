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

export class EmployeeService {
    private handleError: HandleError;
    public apiUrl = environment.SERVER_URL;
    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService,
        private router: Router
    ) {
        this.handleError = handleErrorService.createHandleError('EmployeeService');
    }

    getAllEmployeeList(data: object) {
        const apiPath = `${this.apiUrl}/EmployeeOHSModule/GetAllEmployee`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getAllEmployeeList'))
            );
    }
    addEditEmployee(data: object) {
        const apiPath = `${this.apiUrl}/EmployeeOHSModule/AddEditEmployee`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addEditEmployee'))
            );
    }
    getEmployeeDetailsById(data: object) {
        const apiPath = `${this.apiUrl}/EmployeeOHSModule/GetEmployeeDetailByID`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getEmployeeDetailsById'))
            );
    }
    getEmployeeById(data: object) {
        const apiPath = `${this.apiUrl}/EmployeeOHSModule/GetEmployeeByID`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getEmployeeById'))
            );
    }
    isValidMykadIcNumber(data: object) {
        const apiPath = `${this.apiUrl}/EmployeeOHSModule/IsEmployeeExist`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('isValidMykadIcNumber'))
            );
    }
}