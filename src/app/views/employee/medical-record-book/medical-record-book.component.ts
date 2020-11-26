import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ENTER, COMMA, TAB } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { AuthenticationService, MedicalSurveillanceService, EmployeeService } from '../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import * as _moment from 'moment';
const moment = _moment;
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'ohs-medical-record-book',
  templateUrl: './medical-record-book.component.html',
  styleUrls: ['./medical-record-book.component.scss']
})
export class MedicalRecordBookComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public medicalRecordBookForm!: FormGroup;

  public employeeId: number = 0;
  // public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public medicalRecordBookDetails: any;
  public employeeDetailsForMRB: any = {};
  public saveNext: boolean = false;
  public updateNext: boolean = true;

  public isCollapsed = false;
  public imageUrl: any = 'assets/img/plus-icon.png';
  public selectedFile!: File;
  public selectedName: string = 'Upload Company Logo';
  public imageFile: any;
  public file: any;
  public dataImage: any;
  public filePath: any;
  public imageId: any;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private employeeService: EmployeeService,
    private medicalSurveillanceService: MedicalSurveillanceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];
      // this.doctorId = +params['dId'];

      console.log('employeeId: ', this.employeeId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
      // console.log('doctorId: ', this.doctorId);
    });
  }

  get formControls() {
    return this.medicalRecordBookForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getEmployeeById() {
    this.employeeService.getEmployeeById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        this.employeeDetailsForMRB = result['employeeDataForMedicalConditionModel'];
        console.log(this.employeeDetailsForMRB);
      });
  }
  imageFileSelected(event: any) {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      console.log(this.imageFile);

      this.file = this.imageFile.name.split('.').pop();
      this.imageId = event.target.id;
      console.log(this.imageId);
      
      if ((this.file === 'png' || this.file === 'PNG') || (this.file === 'jpg' || this.file === 'JPG') || (this.file === 'jpeg' || this.file === 'JPEG')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.imageId === 'picUpload') {
            this.imageUrl = reader.result;
            // this.registerForm.patchValue({
            //   profileImage: this.imageFile.name
            // });
          }
        }
        reader.readAsDataURL(this.imageFile);
        this.selectedName = this.imageFile.name;
        this.selectedFile = event.target.files[0];
        console.log(this.selectedName);
        // this.formControls.File.setValue(event.target.files[0].name);
      } else {
        this.selectedName = 'Upload Company Logo';
        this.snackBar.open('Only image files are Supported.', 'Close', {
          panelClass: 'error-popup',
        });
      }
    }
  }

  onSubmit() { }

}
