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
  selector: 'ohs-physical-exam',
  templateUrl: './physical-exam.component.html',
  styleUrls: ['./physical-exam.component.scss']
})
export class PhysicalExamComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public physicalExamForm!: FormGroup;
  // Chip Autocomplete
  separatorKeysCodes: number[] = [ENTER, COMMA, TAB];

  public employeeId: number = 0;
  // public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public physicalExamDetails: any;
  public employeeDetailsForPE: any = {};
  public saveNext: boolean = false;
  public updateNext: boolean = true;
  public maxHeight: number = 250;
  public maxWeight: number = 150;
  public maxBpSystolic: number = 0;
  public minBpSystolic: number = 0;
  public maxBpDiastolic: number = 0;
  public minBpDiastolic: number = 0;
  public bmiClassName: string = '';
  public bmiText: string = '';
  public bloodPsrClass: string = '';
  public bloodPsrText: string = '';

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

    this.physicalExamForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      Weight: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.max(this.maxWeight)]],
      Height: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.max(this.maxHeight)]],
      BMI: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
      BPSys: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(3)]],
      BPDias: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(3)]],
      Pulse: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(3)]],
      "GenAppearance": null,
      "LeftEyeVision": null,
      "LeftEyeVisionProblem": null,
      "RightEyeVision": null,
      "RightEyeVisionProblem": null,
      "LeftFieldVision": null,
      "LeftFieldVisionProblem": null,
      "RightFieldVision": null,
      "RightFieldVisionProblem": null,
      "LeftColorVision": null,
      "LeftColorVisionProblem": null,
      "RightColorVision": null,
      "RightColorVisionProblem": null,
      "LeftFundoscopy": null,
      "LeftFundoscopyProblem": null,
      "RightFundoscopy": null,
      "RightFundoscopyProblem": null,
      "LeftEarCanal": null,
      "LeftEarCanalProblem": null,
      "RightEarCanal": null,
      "RightEarCanalProblem": null,
      "LeftEarDrum": null,
      "LeftEarDrumProblem": null,
      "RightEarDrum": null,
      "RightEarDrumProblem": null,
      "LeftAirConduction": null,
      "LeftAirConductionProblem": null,
      "RightAirConduction": null,
      "RightAirConductionProblem": null,
      "LeftBoneConduction": null,
      "LeftBoneConductionProblem": null,
      "RightBoneConduction": null,
      "RightBoneConductionProblem": null,
      "LeftNose": null,
      "LeftNoseProblem": null,
      "RightNose": null,
      "RightNoseProblem": null,
      "Throat": null,
      "ThroatProblem": null,
      "Nails": null,
      "NailsProblem": null,
      "Skin": null,
      "SkinProblem": null,
      "Lymphatics": null,
      "LymphaticsProblem": null,
      "VericoseVein": null,
      "VericoseVeinProblem": null,
      "CNSOrientation": null,
      "CNSOrientationProblem": null,
      "CNSPlacePerson": null,
      "CNSPlacePersonProblem": null,
      "CNSOther": null,
      "CNSOtherProblem": null,
      "CVSdrnm": null,
      "CVSdrnmProblem": null,
      "CVSOther": null,
      "CVSOtherProblem": null
    });

    this.calculateEmployeeBmi();
    this.calculateBloodPressure();
    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);

    this.getEmployeeById();
    this.getPhysicalExamDetails();
  }

  get formControls() {
    return this.physicalExamForm.controls;
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
        this.employeeDetailsForPE = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForPE);
      });
  }
  getPhysicalExamDetails() {
    const physicalExam = {
      employeeID: this.physicalExamForm.value.EmployeeId,
      employeeOHSTestVisitId: this.physicalExamForm.value.EmployeeOHSTestVisitId
    }
    console.log(physicalExam);

    this.medicalSurveillanceService.getPhysicalExamDetails(physicalExam)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((physicalExamData: any) => {
        console.log(physicalExamData);
        
      });
  }

  calculateEmployeeBmi() {
    if (this.formControls.Weight.value > 0 && this.formControls.Height.value > 0) {
      const calculatedValue = this.formControls.Weight.value / (this.formControls.Height.value / 100 * this.formControls.Height.value / 100);
      const bmi = parseFloat((Math.round(calculatedValue * 100) / 100).toFixed(2));
      this.formControls.BMI.setValue(bmi);

      this.bmiClassName = bmi < 18.5 ? 'bg-orange' : bmi >= 18.5 && bmi <= 25 ? 'bg-green' : bmi > 25 && bmi <= 29.9 ? 'bg-yellow' : 'bg-red';
      this.bmiText = bmi < 18.5 ? 'Underweight' : bmi >= 18.5 && bmi <= 25 ? 'Normal' : bmi > 25 && bmi <= 29.9 ? 'Overweight' : 'Obesity';
    }
  }
  calculateBloodPressure() {
    if (
      this.formControls.BPDias.valid &&
      this.formControls.BPSys.valid
    ) {
      const lowPressure = this.formControls.BPDias.value; // parseFloat(low);
      const highPressure = this.formControls.BPSys.value; // parseFloat(high);

      this.bloodPsrClass = (
        (
          (lowPressure > 120) || (highPressure > 180)
        ) ? 'bg-red' :
          (
            (lowPressure > 120) && (highPressure > 180)
          ) ? 'bg-red' :
            (
              ((lowPressure >= 90) && (lowPressure <= 120)) || ((highPressure >= 140) && (highPressure <= 180))
            ) ? 'bg-softred' :
              (
                ((lowPressure >= 81) && (lowPressure <= 89)) || ((highPressure >= 130) && (highPressure <= 139))
              ) ? 'bg-orange' :
                (
                  (lowPressure <= 80) && ((highPressure >= 121) && (highPressure <= 129))
                ) ? 'bg-yellow' :
                  (
                    ((lowPressure <= 80) && (lowPressure > 60)) && ((highPressure <= 120) && (highPressure > 80))
                  ) ? 'bg-green' :
                    (
                      (lowPressure <= 60) || (highPressure <= 80)
                    ) ? 'bg-red' : ''
      );

      this.bloodPsrText = (
        (
          (lowPressure > 120) || (highPressure > 180)
        ) ? 'Emergency' :
          (
            (lowPressure > 120) && (highPressure > 180)
          ) ? 'Emergency' :
            (
              ((lowPressure >= 90) && (lowPressure <= 120)) || ((highPressure >= 140) && (highPressure <= 180))
            ) ? 'S-2 HT' :
              (
                ((lowPressure >= 81) && (lowPressure <= 89)) || ((highPressure >= 130) && (highPressure <= 139))
              ) ? 'S-1 HT' :
                (
                  (lowPressure <= 80) && ((highPressure >= 121) && (highPressure <= 129))
                ) ? 'Pre HT' :
                  (
                    ((lowPressure <= 80) && (lowPressure > 60)) && ((highPressure <= 120) && (highPressure > 80))
                  ) ? 'Normal' :
                    (
                      (lowPressure <= 60) || (highPressure <= 80)
                    ) ? 'Emergency' : ''
      );
    } else {
      this.bloodPsrClass = '';
      this.bloodPsrText = '';
    }
  }

  onSubmit() {
    this.physicalExamForm.markAllAsTouched();
    console.log(this.physicalExamForm);

    if (this.physicalExamForm.valid) {
      const physicalExamDataPayLoad = {
        labInvestigation: {
          ...this.physicalExamForm.value
        }
      }
      console.log(physicalExamDataPayLoad);

    }
  }
}
