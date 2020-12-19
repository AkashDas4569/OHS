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
export class ReportsService {
  private handleError: HandleError;
  public apiUrl = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private router: Router
  ) {
    this.handleError = handleErrorService.createHandleError('ReportsService');
  }

  getAbnormalExamResults(data: Object) {
    const apiPath = `${this.apiUrl}/ReportOHSModule/GetAbnormalExamResults`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAbnormalExamResults'))
      );
  }
  getMedicalSurSummaryList(data: Object) {
    const apiPath = `${this.apiUrl}/ReportOHSModule/GetMedSurSummaryList`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getMedicalSurSummaryList'))
      );
  }
  getAudiometricReport(data: Object) {
    const apiPath = `${this.apiUrl}/ReportOHSModule/GetAudiometricReport`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAudiometricReport'))
      );
  }
  getMedicalCertificateFitnessReport(data: Object) {
    const apiPath = `${this.apiUrl}/ReportOHSModule/GetMedicalCertificate`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getMedicalCertificateFitnessReport'))
      );
  }
  getMedicalRemovalProtectionReport(data: Object) {
    const apiPath = `${this.apiUrl}/ReportOHSModule/GetMedicalRemoval`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getMedicalRemovalProtectionReport'))
      );
  }

}
