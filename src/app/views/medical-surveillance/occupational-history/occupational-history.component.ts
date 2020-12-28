import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, MedicalSurveillanceService, EmployeeService } from '../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ohs-occupational-history',
  templateUrl: './occupational-history.component.html',
  styleUrls: ['./occupational-history.component.scss']
})
export class OccupationalHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public occupationalHistoryForm!: FormGroup;

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public occupationalHistoryDetails: any;
  public employeeDetailsForOH: any = {};
  public saveNext: boolean = false;
  public updateNext: boolean = true;

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
      this.doctorId = +params['dId'];
      this.employeeTestVisitId = +params['eTestVisitId'];

      // console.log('employeeId: ', this.employeeId);
      // console.log('doctorId: ', this.doctorId);
      // console.log('employeeTestVisitId: ', this.employeeTestVisitId);
    });

    this.occupationalHistoryForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      OHDoctorId: ['', Validators.required],
      JobPast: [''],
      JobPresent: [''],
      HazardTypePast: [''],
      HazardTypePresent: [''],
      EmploymentPast: [''],
      EmploymentPresent: [''],
      TrainingPast: [''],
      TrainingPresent: [''],
      OtherJobPast: [''],
      OtherJobPresent: [''],
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.OHDoctorId.setValue(this.doctorId);

    this.getEmployeeById();
    this.getOccupationalHistoryDetails();
  }

  get formControls() {
    return this.occupationalHistoryForm.controls;
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
        this.employeeDetailsForOH = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForOH);
    });
  }
  getOccupationalHistoryDetails() {
    const occupationalHistory = {
      employeeID: this.occupationalHistoryForm.value.EmployeeId,
      employeeOHSTestVisitId: this.occupationalHistoryForm.value.EmployeeOHSTestVisitId
    }
    // console.log(occupationalHistory);

    this.medicalSurveillanceService.getOccupationalHistoryDetails(occupationalHistory)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((occupationalHistoryData: any) => {
      if(occupationalHistoryData['status'] == 200){
        this.occupationalHistoryDetails = occupationalHistoryData['occupationalHistory'];
        // console.log(this.occupationalHistoryDetails);

        this.occupationalHistoryForm.patchValue({
          Id: this.occupationalHistoryDetails.Id,
          EmployeeId: this.occupationalHistoryDetails.EmployeeId,
          OHDoctorId: this.occupationalHistoryDetails.OHDoctorId,
          EmployeeOHSTestVisitId: this.occupationalHistoryDetails.EmployeeOHSTestVisitId,
          JobPast: this.occupationalHistoryDetails.JobPast,
          JobPresent: this.occupationalHistoryDetails.JobPresent,
          HazardTypePast: this.occupationalHistoryDetails.HazardTypePast,
          HazardTypePresent: this.occupationalHistoryDetails.HazardTypePresent,
          EmploymentPast: this.occupationalHistoryDetails.EmploymentPast,
          EmploymentPresent: this.occupationalHistoryDetails.EmploymentPresent,
          TrainingPast: this.occupationalHistoryDetails.TrainingPast,
          TrainingPresent: this.occupationalHistoryDetails.TrainingPresent,
          OtherJobPast: this.occupationalHistoryDetails.OtherJobPast,
          OtherJobPresent: this.occupationalHistoryDetails.OtherJobPresent,
        });
      }
    });
  }

  onSubmit() {
    this.occupationalHistoryForm.markAllAsTouched();
    // console.log(this.occupationalHistoryForm);

    if (this.occupationalHistoryForm.valid) {
    const occupationalHistoryDataPayLoad = {
      occupationalHistory: {
      ...this.occupationalHistoryForm.value
      }
    }
    // console.log(occupationalHistoryDataPayLoad);

    this.medicalSurveillanceService.addEditOccupationalHistory(occupationalHistoryDataPayLoad)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((response: any) => {
      // console.log(response);
      if(response['status'] == 200) {
        if(this.occupationalHistoryForm.value.Id > 0) {
          this.snackBar.open('Updated Successfully', 'Close', {
            panelClass: 'success-popup',
          });

          this.getOccupationalHistoryDetails();
          this.updateNext = true;
        } else {
          this.snackBar.open('Saved Successfully', 'Close', {
            panelClass: 'success-popup',
          });

          this.getOccupationalHistoryDetails();
          this.saveNext = true;
        }
      }else {
        this.snackBar.open('Something went wrong! Please try again.', 'Close', {
          panelClass: 'error-popup',
        });
      }
    });
  }
}
}
