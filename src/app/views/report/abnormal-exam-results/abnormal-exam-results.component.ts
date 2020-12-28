import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
// Server Link
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ohs-abnormal-exam-results',
  templateUrl: './abnormal-exam-results.component.html',
  styleUrls: ['./abnormal-exam-results.component.scss']
})
export class AbnormalExamResultsComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public apiUrl = environment.SERVER_URL;
  public abnormalExamResultForm!: FormGroup;

  public minDate = moment('2016').startOf('y');
  public maxDate = moment();
  public customDate = new Date();
  public noDataText: string = `Please wait while we're fetching your data...`;
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 10;
  public allClientList: any[] = [];
  public abnormalExamResultDetails: any[] = [];

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
    this.abnormalExamResultForm = this.fb.group({
      FromDate: [moment().startOf('M'), Validators.required],
      ToDate: [moment(), Validators.required],
      ClientId: ['', Validators.required],
    });

    this.getCompanyList();
    // this.getAbnormalExamResults();
  }

  get formControls() {
    return this.abnormalExamResultForm.controls;
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
  getAbnormalExamResults() {
    this.abnormalExamResultForm.value.FromDate = this.formControls.FromDate.value.format('DD/MM/YYYY');
    this.abnormalExamResultForm.value.ToDate = this.formControls.ToDate.value.format('DD/MM/YYYY');
    this.noDataText = `Please wait while we're fetching your data...`;

    this.reportsService.getAbnormalExamResults(this.abnormalExamResultForm.value)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((abnormalExamReport: any) => {
      this.abnormalExamResultDetails = abnormalExamReport['MedAbnormalResult'];
      // console.log(this.abnormalExamResultDetails);
      
      this.noDataText = 'No Data Found.';
    });
  }
  onSubmit() {
    this.abnormalExamResultForm.markAllAsTouched();
    // console.log(this.abnormalExamResultForm);
    this.abnormalExamResultForm.value.FromDate = this.formControls.FromDate.value.format('DD/MM/YYYY');
    this.abnormalExamResultForm.value.ToDate = this.formControls.ToDate.value.format('DD/MM/YYYY');

    if(this.abnormalExamResultForm.valid) {
      // console.log('Valid');
      this.getAbnormalExamResults();
    } else {
      // console.log('Invalid');
    }
  }

  downloadExcelReport() {
    const splittedLocation = window.location.href.split(/[\+\-:/. )(]/g);
    const url = `${this.apiUrl}/ReportOHSModule/DownloadAbnormalReport?authKey=` + this.authenticationService.getToken() + `&fromDate=` + this.abnormalExamResultForm.value.FromDate + `&toDate=` + this.abnormalExamResultForm.value.ToDate + `&clientId=` + this.abnormalExamResultForm.value.ClientId + `&subdomain=`+ splittedLocation[3];
    window.open(url, '_blank');
    
    this.snackBar.open('Download Successfully', 'Close', {
      panelClass: 'success-popup',
    });
  }
}
