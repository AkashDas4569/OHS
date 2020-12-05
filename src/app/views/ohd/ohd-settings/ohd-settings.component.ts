import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService, OhdService } from '../../../core/services';
import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
const moment = _moment;
// const moment = _rollupMoment || _moment;

@Component({
  selector: 'ohs-ohd-settings',
  templateUrl: './ohd-settings.component.html',
  styleUrls: ['./ohd-settings.component.scss']
})
export class OhdSettingsComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public ohdSettingsForm!: FormGroup;
  public minDate = moment('2016').startOf('y');
  public maxDate = moment();
  public allOhdList: any;
  public allOhdClinic: any;
  public editData: any;
  public ohdSettingsDataPayLoad: any = {};
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 25;
  public totalDocuments: number = 25;
  public noDataText: string = `Please wait while we're fetching your data...`;

  constructor(
    private authenticationService: AuthenticationService,
    private ohdService: OhdService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.ohdSettingsForm = this.fb.group({
      Id: [''],
      Active: [true],
      OHDName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      // QualificationDate: [moment(), Validators.required],
      OHDQual: ['', [Validators.required, Validators.pattern(/^[a-zA-Z, ]*$/)]],
      OHDEmail: ['', [Validators.required, Validators.email]],
      OHDPhone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(14)
      ]],
      OHDmmcNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      DOSHRegNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],

      // OHDClinicId: ['', Validators.required],
      clinicName: [''],
      ClinicTelNumber: ['', [
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(9),
        Validators.maxLength(13)
      ]],
      ClinicEmail: ['', Validators.email],
    });

    this.getOhdClinic();
    this.getOhdList(this.pageSize, 0);
  }

  get formControls() {
    return this.ohdSettingsForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getOhdClinic() {
    this.ohdService.getOhdClinic({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allOhdClinic: any) => {
        this.allOhdClinic = allOhdClinic['ohdClinic'];
        console.log(this.allOhdClinic);
        // console.log(this.allOhdClinic.cName);

        this.formControls.clinicName.setValue(this.allOhdClinic.cName);
        this.formControls.ClinicTelNumber.setValue(this.allOhdClinic.cTel);
        this.formControls.ClinicEmail.setValue(this.allOhdClinic.cEmail);
      });
  }
  getOhdList(pageSize: number, page: number) {
    this.pageSize = pageSize;
    page -= 1;
    const pageNumber = (page <= 0 ? 0 : (page * this.pageSize));
    const doctorDataPayLoad = {
      skip: pageNumber,
      take: this.pageSize
    };
    this.noDataText = `Please wait while we're fetching your data...`;

    this.ohdService.getOhdList(doctorDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allOhdList: any) => {
        console.log(allOhdList);
        this.allOhdList = allOhdList['ohdDoctor'];
        this.totalDocuments = allOhdList['totalNumber'];
        this.numberOfPages = Math.ceil(this.totalDocuments/this.pageSize);
        console.log('No. of Pages: ', this.numberOfPages);
        console.log('Total Number: ', this.totalDocuments);
        
        console.log(this.allOhdList);
        this.noDataText = 'No Data Found';
      });
  }

  prevPage(pageSize: any) {
    this.currentPage = this.currentPage - 1;
    this.getOhdList(pageSize, this.currentPage);
  }
  nextPage(pageSize: any) {
    this.currentPage = this.currentPage + 1;
    this.getOhdList(pageSize, this.currentPage);
  }
  pageEntered(pageSize: any) {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    if (this.currentPage > this.numberOfPages) {
      this.currentPage = this.numberOfPages;
    }
    this.getOhdList(pageSize, this.currentPage);
}

  onSubmit() {
    this.ohdSettingsForm.markAllAsTouched();
    // this.ohdSettingsForm.value.OHDQual = moment(this.ohdSettingsForm.value.OHDQual).format('DD/MM/YYYY');

    if (this.ohdSettingsForm.value.Id > 0) {
    this.ohdSettingsDataPayLoad = {
      ohdDoctor: {
      Id: this.ohdSettingsForm.value.Id,
      Active: this.ohdSettingsForm.value.Active,
      OHDName: this.ohdSettingsForm.value.OHDName,
      OHDQual: this.ohdSettingsForm.value.OHDQual,
      OHDEmail: this.ohdSettingsForm.value.OHDEmail,
      OHDPhone: this.ohdSettingsForm.value.OHDPhone,
      OHDClinicId: +(this.allOhdClinic.Id),
      OHDmmcNo: this.ohdSettingsForm.value.OHDmmcNo,
      DOSHRegNo: this.ohdSettingsForm.value.DOSHRegNo
      }
    }

    console.log(this.ohdSettingsDataPayLoad);
  } else {
    this.ohdSettingsDataPayLoad = {
      ohdDoctor: {
      Id: 0,
      Active: this.ohdSettingsForm.value.Active,
      OHDName: this.ohdSettingsForm.value.OHDName,
      OHDQual: this.ohdSettingsForm.value.OHDQual,
      OHDEmail: this.ohdSettingsForm.value.OHDEmail,
      OHDPhone: this.ohdSettingsForm.value.OHDPhone,
      OHDClinicId: +(this.allOhdClinic.Id),
      OHDmmcNo: this.ohdSettingsForm.value.OHDmmcNo,
      DOSHRegNo: this.ohdSettingsForm.value.DOSHRegNo
      }
    }

    console.log(this.ohdSettingsDataPayLoad);
  }
    this.currentPage = 1;
    if (this.ohdSettingsForm.valid) {
      // console.log(this.ohdSettingsForm);
      
      this.ohdService.addEditOhdModule(this.ohdSettingsDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if (response['status'] == 200) {
          if(this.ohdSettingsForm.value.Id == 0) {
          this.snackBar.open('Saved Successfully', 'Close', {
            panelClass: 'success-popup',
          });
        } else {
          this.snackBar.open('Updated Successfully', 'Close', {
            panelClass: 'success-popup',
          });
        }

          this.ohdSettingsForm.patchValue({
            Id: ''
          });
          
          this.getOhdList(this.pageSize, this.currentPage);
          this.resetCancel();
        } else {
          this.snackBar.open('Something went wrong! Please try again.', 'Close', {
            panelClass: 'error-popup',
          });
        }
      });
    } else {
      // console.log(this.ohdSettingsForm);
    }
  }

  clickToEdit(details: FormGroup) {
    window.scroll(0, 0);
    this.editData = details;
    // console.log(this.editData);
    this.ohdSettingsForm.patchValue({
      Id: this.editData.Id,
      Active: this.editData.Active,
      OHDName: this.editData.OHDName,
      OHDQual: this.editData.OHDQual,
      OHDEmail: this.editData.OHDEmail,
      OHDPhone: this.editData.OHDPhone,
      OHDClinicId: +(this.editData.OHDClinicId),
      OHDmmcNo: this.editData.OHDmmcNo,
      DOSHRegNo: this.editData.DOSHRegNo
    });
  }

  resetCancel() {
    this.formDirective.resetForm();

    this.formControls.clinicName.setValue(this.allOhdClinic.cName);
    this.formControls.ClinicTelNumber.setValue(this.allOhdClinic.cTel);
    this.formControls.ClinicEmail.setValue(this.allOhdClinic.cEmail);
  }

  openModal(template: any, data: any) {
    template.openModal(data);
  }
  getDeletedOhdSettings(event: any) {
    this.currentPage = 1;

    this.getOhdList(this.pageSize, this.currentPage);
  }
}
