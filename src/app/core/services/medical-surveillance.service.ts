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

export class MedicalSurveillanceService {
    private handleError: HandleError;
    public apiUrl = environment.SERVER_URL;
    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService,
        private router: Router
    ) {
        this.handleError = handleErrorService.createHandleError('MedicalSurveillanceService');
    }

    addMedicalSurveillance(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/AddMedSur`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addMedicalSurveillance'))
            );
    }
    getAllCheckInMedSurQueue(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/GetAllCheckInMedQ`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getAllCheckInMedSurQueue'))
            );
    }
    getMedicalConditionDetails(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/GetMSMedCon`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getMedicalConditionDetails'))
            );
    }
    addEditMedicalCondititon(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/AddEditMedicalCondition`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addEditMedicalCondititon'))
            );
    }
    getPastMedicalHistoryDetails(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/GetMSPastMedHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getPastMedicalHistoryDetails'))
            );
    }
    addEditPastMedicalHistory(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/AddEditMSPastMedHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addEditPastMedicalHistory'))
            );
    }
    getFamilyHistoryDetails(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/GetFamilyHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getFamilyHistoryDetails'))
            );
    }
    addEditFamilyHistory(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/AddEditFamilyHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addEditFamilyHistory'))
            );
    }
    getOccupationalHistoryDetails(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/GetOccupationalHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getOccupationalHistoryDetails'))
            );
    }
    addEditOccupationalHistory(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/AddEditOccupationalHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addEditOccupationalHistory'))
            );
    }
    getChemicalHistoryDetails(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/GetMSChemicalHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('getChemicalHistoryDetails'))
            );
    }
    addEditChemicalHistory(data: object) {
        const apiPath = `${this.apiUrl}/MedSurOHSModule/AddEditMSChemicalHistory`;
        return this.http.post(apiPath, data, httpOptions)
            .pipe(
                map(response => response),
                catchError(this.handleError('addEditChemicalHistory'))
            );
    }
 
}
