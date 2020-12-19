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

export class LookupService {
  private handleError: HandleError;
  public apiUrl = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private router: Router
  ) {
    this.handleError = handleErrorService.createHandleError('LookupService');
  }

  getCountryList(data: object) {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetCountryList`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getCountryList'))
      );
  }
  getEthnicList(data: object) {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetEthinicLists`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getEthnicList'))
      );
  }
  getStateList(data: string) {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetStateList`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getStateList'))
      );
  }
  getCityList(data: string) {
    const apiPath = `${this.apiUrl}/LookupOHSModule/CityList`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getCityList'))
      );
  }
  getIndustryList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetIndSectorList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getIndustryList'))
      );
  }
  getChemicalList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetChemicalLists`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getChemicalList'))
      );
  }
  getClientList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetClientList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getClientList'))
      );
  }
  getVisitPurposeList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetTestTypeList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getVisitPurposeList'))
      );
  }
  getOHDDoctorList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetOHDoctor`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getVisitPurposeList'))
      );
  }
  getMedicalSurveillanceStatusList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetMedSurStatusList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getMedicalSurveillanceStatusList'))
      );
  }
  getMedicalSurveillanceQueueStatusList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetMedSurQStatusList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getMedicalSurveillanceQueueStatusList'))
      );
  }
  getAudiometricStatusList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetAudTstStatusList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('getAudiometricStatusList'))
      );
  }
  getAudiometricQueueStatusList() {
    const apiPath = `${this.apiUrl}/LookupOHSModule/GetAudioQStatusList`;
    return this.http.post(apiPath, httpOptions)
      .pipe(
        map(response => response), 
        catchError(this.handleError('getAudiometricQueueStatusList'))
      );
  }

  downloadAbnormalReport(data: Object) {
    const apiPath = `${this.apiUrl}/LookupOHSModule/DownloadAbnormalReport`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response), 
        catchError(this.handleError('downloadAbnormalReport'))
      );
  }
}