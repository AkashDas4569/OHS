import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';

import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, ReportsService } from '../../../core/services';
// RxJs
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'ohs-medical-surveillance-summary',
  templateUrl: './medical-surveillance-summary.component.html',
  styleUrls: ['./medical-surveillance-summary.component.scss']
})
export class MedicalSurveillanceSummaryComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  // @ViewChild('pdfTable') pdfTable!: ElementRef;
  private onDestroyUnSubscribe = new Subject<void>();
  public medicalSurveillanceSummaryForm!: FormGroup;

  public minDate = moment('2016').startOf('y');
  public maxDate = moment();
  public customDate = new Date();
  public noDataText: string = `Please wait while we're fetching your data...`;
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 50;
  public totalDocuments: number = 50;
  public allClientList: any[] = [];
  public medicalSurveillanceSummaryDetails: any[] = [];

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.medicalSurveillanceSummaryForm = this.fb.group({
      FromDate: [moment().startOf('M'), Validators.required],
      ToDate: [moment(), Validators.required],
      ClientId: ['', Validators.required],
      skip: [0],
      take: [10]
    });

    this.getCompanyList();
  }

  get formControls() {
    return this.medicalSurveillanceSummaryForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getCompanyList() {
    this.lookupService.getClientList()
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((clientList: any) => {
      this.allClientList = clientList['ClientList'];
      // console.log(this.allClientList);
    });
  }
  getMedicalSurSummaryList(pageSize: number, page: number) {
    this.medicalSurveillanceSummaryForm.value.FromDate = this.formControls.FromDate.value.format('DD/MM/YYYY');
    this.medicalSurveillanceSummaryForm.value.ToDate = this.formControls.ToDate.value.format('DD/MM/YYYY');
    
    this.pageSize = pageSize;
    page -= 1;
    const pageNumber = (page <= 0 ? 0 : (page * this.pageSize));
    const medicalSurDataPayLoad = {
      FromDate: this.medicalSurveillanceSummaryForm.value.FromDate,
      ToDate: this.medicalSurveillanceSummaryForm.value.ToDate,
      ClientId:  this.medicalSurveillanceSummaryForm.value.ClientId,
      skip: pageNumber,
      take: this.pageSize
    };
    // console.log(medicalSurDataPayLoad);
    this.noDataText = `Please wait while we're fetching your data...`;

    this.reportsService.getMedicalSurSummaryList(medicalSurDataPayLoad)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((medicalSurveillanceSummaryReport: any) => {
      this.medicalSurveillanceSummaryDetails = medicalSurveillanceSummaryReport['MedSurSummary'];
      this.totalDocuments = medicalSurveillanceSummaryReport['totalNumber'];
      this.numberOfPages = Math.ceil(this.totalDocuments/this.pageSize);
      console.log('No. of Pages: ', this.numberOfPages);
      console.log('Total Number: ', this.totalDocuments);

      console.log(this.medicalSurveillanceSummaryDetails);
      this.noDataText = 'No Data Found.';
    });
  }

  prevPage(pageSize: any) {
    this.currentPage = this.currentPage - 1;
    this.getMedicalSurSummaryList(pageSize, this.currentPage);
  }
  nextPage(pageSize: any) {
    this.currentPage = this.currentPage + 1;
    this.getMedicalSurSummaryList(pageSize, this.currentPage);
  }
  pageEntered(pageSize: any) {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    if (this.currentPage > this.numberOfPages) {
      this.currentPage = this.numberOfPages;
    }
    this.getMedicalSurSummaryList(pageSize, this.currentPage);
}

goToMedicalSurveillanceReport(data: any) {
  // console.log(data);
  console.log(data.EmployeeID, data.EmployeeOHSTestVisitID);

  const url = '/report-result/medical-surveillance-report-result/' + data.EmployeeID + '/' + data.EmployeeOHSTestVisitID
  console.log(url);

  window.open(url, "_blank");
}
goToCertificateFitness(data: any) {
  // console.log(data);
  console.log(data.EmployeeID, data.EmployeeOHSTestVisitID);

  const url = '/report-result/certificate-fitness/' + data.EmployeeID + '/' + data.EmployeeOHSTestVisitID
  console.log(url);
    
  window.open(url, "_blank");
}
goToMedicalRemovalProtection(data: any) {
  // console.log(data);
  console.log(data.EmployeeID, data.EmployeeOHSTestVisitID);

  const url = '/report-result/medical-removal-protection/' + data.EmployeeID + '/' + data.EmployeeOHSTestVisitID
  console.log(url);

  window.open(url, "_blank");
}
  
  onSubmit() {
    this.medicalSurveillanceSummaryForm.markAllAsTouched();
    console.log(this.medicalSurveillanceSummaryForm);
    this.medicalSurveillanceSummaryForm.value.FromDate = this.formControls.FromDate.value.format('DD/MM/YYYY');
    this.medicalSurveillanceSummaryForm.value.ToDate = this.formControls.ToDate.value.format('DD/MM/YYYY');
    
    this.currentPage = 1;
    if(this.medicalSurveillanceSummaryForm.valid) {
      console.log('Valid');
      this.getMedicalSurSummaryList(this.pageSize, this.currentPage);
    } else {
      console.log('Invalid');
    }
  }
}
