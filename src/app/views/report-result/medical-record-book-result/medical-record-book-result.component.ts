import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, EmployeeService, MedicalSurveillanceService, OhdService, ReportsService } from '../../../core/services';
// RxJs
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'ohs-medical-record-book-result',
  templateUrl: './medical-record-book-result.component.html',
  styleUrls: ['./medical-record-book-result.component.scss']
})
export class MedicalRecordBookResultComponent implements OnInit {
  private onDestroyUnSubscribe = new Subject<void>();

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public employeeDetails: any = {};
  public medicalRecordBookDetails: any = {};
  public medicalCertificateFitnessDetails: any = {};

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private medicalSurveillanceService: MedicalSurveillanceService,
    private ohdService: OhdService,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];

      // console.log('employeeId: ', this.employeeId);
      // console.log('employeeTestVisitId: ', this.employeeTestVisitId);
    });

    this.getMedicalRecordBookDetails();
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getMedicalRecordBookDetails() {
    // General Information API
    this.employeeService.getEmployeeDetailsById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if (response['status'] == 200) {
          this.employeeDetails = response['employeeDetails'];
        }
      });

      // Employee Medical Record Book
    const medicalRecordBook = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(medicalRecordBook);

    this.medicalSurveillanceService.getRecordBookDetails(medicalRecordBook)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalRecordBookData: any) => {
        if (medicalRecordBookData['status'] == 200) {
          this.medicalRecordBookDetails = medicalRecordBookData['msRecordBook'];
          // console.log('Medical Record Book ==>', this.medicalRecordBookDetails);
        }
      });
       // CertificateFitness API
       const medicalCertificateFitness = {
        employeeID: this.employeeId,
        employeeOHSTestVisitId: this.employeeTestVisitId,
      }
      // console.log(medicalCertificateFitness);
   
      this.reportsService.getMedicalCertificateFitnessReport(medicalCertificateFitness)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalCertificateFitnessData: any) => {
        if (medicalCertificateFitnessData['status'] == 200) {
          this.medicalCertificateFitnessDetails = medicalCertificateFitnessData['MedicalCertificate'];
          // console.log('Medical Certificate ==>', this.medicalCertificateFitnessDetails);
        }
      });
  }
  downloadPdf() {
    // console.log('Pdf Download');
    window.print();
  }
  closePdf() {
    window.close();
  }
}
