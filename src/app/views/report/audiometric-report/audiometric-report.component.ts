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

@Component({
  selector: 'ohs-audiometric-report',
  templateUrl: './audiometric-report.component.html',
  styleUrls: ['./audiometric-report.component.scss']
})
export class AudiometricReportComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public audiometricResultForm!: FormGroup;

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
  public audiometricResultDetails: any[] = [];

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
    this.audiometricResultForm = this.fb.group({
      FromDate: [moment().startOf('M'), Validators.required],
      ToDate: [moment(), Validators.required],
      ClientId: ['', Validators.required],
      skip: [0],
      take: [10]
    });

    this.getCompanyList();
  }

  get formControls() {
    return this.audiometricResultForm.controls;
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
  getAudiometricReport(pageSize: number, page: number) {
    this.audiometricResultForm.value.FromDate = this.formControls.FromDate.value.format('DD/MM/YYYY');
    this.audiometricResultForm.value.ToDate = this.formControls.ToDate.value.format('DD/MM/YYYY');

    this.pageSize = pageSize;
    page -= 1;
    const pageNumber = (page <= 0 ? 0 : (page * this.pageSize));
    const audiometricDataPayLoad = {
      FromDate: this.audiometricResultForm.value.FromDate,
      ToDate: this.audiometricResultForm.value.ToDate,
      ClientId:  this.audiometricResultForm.value.ClientId,
      skip: pageNumber,
      take: this.pageSize
    };
    console.log(audiometricDataPayLoad);
    this.noDataText = `Please wait while we're fetching your data...`;

    this.reportsService.getAudiometricReport(audiometricDataPayLoad)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((audiometricResultDetails: any) => {
      this.audiometricResultDetails = audiometricResultDetails['AudiometricReport'];
      this.totalDocuments = audiometricResultDetails['totalNumber'];
      this.numberOfPages = Math.ceil(this.totalDocuments/this.pageSize);
      console.log('No. of Pages: ', this.numberOfPages);
      console.log('Total Number: ', this.totalDocuments);

      console.log(this.audiometricResultDetails);
      this.noDataText = 'No Data Found.';
    });
  }

  prevPage(pageSize: any) {
    this.currentPage = this.currentPage - 1;
    this.getAudiometricReport(pageSize, this.currentPage);
  }
  nextPage(pageSize: any) {
    this.currentPage = this.currentPage + 1;
    this.getAudiometricReport(pageSize, this.currentPage);
  }
  pageEntered(pageSize: any) {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    if (this.currentPage > this.numberOfPages) {
      this.currentPage = this.numberOfPages;
    }
    this.getAudiometricReport(pageSize, this.currentPage);
}

  goToAudiometricReport(data: any) {
    // console.log(data);
    // console.log(data.EmployeeID, data.EmployeeOHSTestVisitID);
    const url = '/report-result/audiometric-report-result/' + data.EmployeeID + '/' + data.EmployeeOHSTestVisitID
    console.log(url);
    
    window.open(url, "_blank");
  }

  onSubmit() {
    this.audiometricResultForm.markAllAsTouched();
    console.log(this.audiometricResultForm);
    this.audiometricResultForm.value.FromDate = this.formControls.FromDate.value.format('DD/MM/YYYY');
    this.audiometricResultForm.value.ToDate = this.formControls.ToDate.value.format('DD/MM/YYYY');

    this.currentPage = 1;
    if(this.audiometricResultForm.valid) {
      console.log('Valid');
      this.getAudiometricReport(this.pageSize, this.currentPage);
    } else {
      console.log('Invalid');
    }
  }
}
