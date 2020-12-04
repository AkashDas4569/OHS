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
export class AudiometricService {
  private handleError: HandleError;
  public apiUrl = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private router: Router
  ) {
    this.handleError = handleErrorService.createHandleError('AudiometricService');
  }

  addAudiometric(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/AddAudiometric`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addAudiometric'))
      );
  }
  getAllCheckInAudiometricQueue(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/GetAllCheckInAudQ`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAllCheckInAudiometricQueue'))
      );
  }
  getOccupationalNoiseExposureDetails(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/GetAudiometricOccNoiseExpo`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getOccupationalNoiseExposureDetails'))
      );
  }
  addEditOccupationalNoiseExposure(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/AddEditAuOccNoiseExpo`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addEditOccupationalNoiseExposure'))
      );
  }
  getMedicalHistoryDetails(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/GetAuMedHistory`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getMedicalHistoryDetails'))
      );
  }
  addEditMedicalHistory(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/AddEditAuMedHistory`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addEditMedicalHistory'))
      );
  }
  getAudiometricResultDetails(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/GetAudiometricResult`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAudiometricResultDetails'))
      );
  }
  addEditAudiometricResult(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/AddEditAudiometricResult`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('addEditAudiometricResult'))
      );
  }
  getCheckoutDetails(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/GetCheckOutStatus`;
    return this.http.post(apiPath, data, httpOptions)
        .pipe(
            map(response => response),
            catchError(this.handleError('getCheckoutDetails'))
        );
}
addEditCheckout(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/AudiometricCheckOut`;
    return this.http.post(apiPath, data, httpOptions)
        .pipe(
            map(response => response),
            catchError(this.handleError('addEditCheckout'))
        );
}
getAllCheckOutAudiometricQueue(data: object) {
    const apiPath = `${this.apiUrl}/AudiometricOHSModule/GetAllCheckOutAudQ`;
    return this.http.post(apiPath, data, httpOptions)
        .pipe(
            map(response => response),
            catchError(this.handleError('getAllCheckOutAudiometricQueue'))
        );
}
}
