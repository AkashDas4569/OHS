import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, MedicalSurveillanceService, EmployeeService } from '../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';

// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'ohs-exam-outcome-record',
  templateUrl: './exam-outcome-record.component.html',
  styleUrls: ['./exam-outcome-record.component.scss']
})
export class ExamOutcomeRecordComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public examOutcomeForm!: FormGroup;

  public employeeId: number = 0;
  // public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public examOutcomeDetails: any;
  public employeeDetailsForEOR: any = {};
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
      this.employeeTestVisitId = +params['eTestVisitId'];
      // this.doctorId = +params['dId'];

      console.log('employeeId: ', this.employeeId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
      // console.log('doctorId: ', this.doctorId);
    });

    this.examOutcomeForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      MedRemove: [false],
      Exposed: [false],
      UsePPE: [false],
      NoMoreExpose: [false],
      ChangeJob: [false],
      AwayFromWork: [false],
      EarlyRetire: [false],
      Unemployed: [false],
      Refer: [false],
      Compensation: [false],
      Other: [false],
      OtherSpecify: [''],
      RecosId: [0],
      RecosEmployer: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      RecosEmployee: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      RecosAssessor: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      RecosRefer: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      RecosOthers: ['', Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);

    this.getEmployeeById();
    this.getExamOutComeDetails();
  }

  get formControls() {
    return this.examOutcomeForm.controls;
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
        this.employeeDetailsForEOR = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForEOR);
      });
  }
  getExamOutComeDetails() {
    const examOutcome = {
      employeeID: this.examOutcomeForm.value.EmployeeId,
      employeeOHSTestVisitId: this.examOutcomeForm.value.EmployeeOHSTestVisitId
    }
    // console.log(examOutcome);

    this.medicalSurveillanceService.getExamOutComeDetails(examOutcome)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((examOutcomeData: any) => {
        if (examOutcomeData['status'] == 200) {
          this.examOutcomeDetails = examOutcomeData['examOutcome'];
          console.log(this.examOutcomeDetails);

          
          this.examOutcomeForm.patchValue({
            Id: this.examOutcomeDetails.Id,
            EmployeeId: this.examOutcomeDetails.EmployeeId,
            EmployeeOHSTestVisitId: this.examOutcomeDetails.EmployeeOHSTestVisitId,
            MedRemove: this.examOutcomeDetails.MedRemove,
            Exposed: this.examOutcomeDetails.Exposed,
            UsePPE: this.examOutcomeDetails.NoMoreExpose,
            NoMoreExpose: this.examOutcomeDetails.NoMoreExpose,
            ChangeJob: this.examOutcomeDetails.ChangeJob,
            AwayFromWork: this.examOutcomeDetails.AwayFromWork,
            EarlyRetire: this.examOutcomeDetails.EarlyRetire,
            Unemployed: this.examOutcomeDetails.Unemployed,
            Refer: this.examOutcomeDetails.Refer,
            Compensation: this.examOutcomeDetails.Compensation,
            Other: this.examOutcomeDetails.Other,
            OtherSpecify: this.examOutcomeDetails.OtherSpecify,
            RecosId: this.examOutcomeDetails.RecosId,
            RecosEmployer: this.examOutcomeDetails.RecosEmployer,
            RecosEmployee: this.examOutcomeDetails.RecosEmployee,
            RecosAssessor: this.examOutcomeDetails.RecosAssessor,
            RecosRefer: this.examOutcomeDetails.RecosRefer,
            RecosOthers: this.examOutcomeDetails.RecosOthers
          });
        }
      });
    }

  onSubmit() {
    this.examOutcomeForm.markAllAsTouched();
    console.log(this.examOutcomeForm);

    if (this.examOutcomeForm.valid) {
      const examOutcomeDataPayLoad = {
        examOutcome: {
          ...this.examOutcomeForm.value
        }
      }
      console.log(examOutcomeDataPayLoad);

      this.medicalSurveillanceService.addEditExamOutCome(examOutcomeDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        console.log(response);
        if (response['status'] == 200) {
          if ((this.examOutcomeForm.value.Id > 0) && (this.examOutcomeForm.value.RecosId > 0)) {
            this.snackBar.open('Updated Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getExamOutComeDetails();
            this.updateNext = true;
          } else {
            this.snackBar.open('Saved Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getExamOutComeDetails();
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
