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
      GenAppearance: [''],

      LeftEyeVision: [''],
      LeftEyeVisionProblem: [''],
      RightEyeVision: [''],
      RightEyeVisionProblem: [''],
      LeftFieldVision: [''],
      LeftFieldVisionProblem: [''],
      RightFieldVision: [''],
      RightFieldVisionProblem: [''],
      LeftColorVision: [''],
      LeftColorVisionProblem: [''],
      RightColorVision: [''],
      RightColorVisionProblem: [''],
      LeftFundoscopy: [''],
      LeftFundoscopyProblem: [''],
      RightFundoscopy: [''],
      RightFundoscopyProblem: [''],
      LeftEarCanal: [''],
      LeftEarCanalProblem: [''],
      RightEarCanal: [''],
      RightEarCanalProblem: [''],
      LeftEarDrum: [''],
      LeftEarDrumProblem: [''],
      RightEarDrum: [''],
      RightEarDrumProblem: [''],
      LeftAirConduction: [''],
      LeftAirConductionProblem: [''],
      RightAirConduction: [''],
      RightAirConductionProblem: [''],
      LeftBoneConduction: [''],
      LeftBoneConductionProblem: [''],
      RightBoneConduction: [''],
      RightBoneConductionProblem: [''],
      LeftNose: [''],
      LeftNoseProblem: [''],
      RightNose: [''],
      RightNoseProblem: [''],
      Throat: [''],
      ThroatProblem: [''],
      Nails: [''],
      NailsProblem: [''],
      Skin: [''],
      SkinProblem: [''],
      Lymphatics: [''],
      LymphaticsProblem: [''],
      VericoseVein: [''],
      VericoseVeinProblem: [''],
      CNSOrientation: [''],
      CNSOrientationProblem: [''],
      CNSPlacePerson: [''],
      CNSPlacePersonProblem: [''],
      CNSOther: [''],
      CNSOtherProblem: [''],
      CVSdrnm: [''],
      CVSdrnmProblem: [''],
      CVSOther: [''],
      CVSOtherProblem: [''],

      RSChestExpension: [''],
      RSAirEntry: [''],
      RSCrepitations: [''],
      RSWheeze: [''],
      RSOthers: [''],
      GSLiver: [''],
      GSSpleen: [''],
      GSAbdomen: [''],
      GSOthers: [''],
      GenKidney: [''],
      GenBladder: [''],
      GenUterus: [''],
      GenOthers: [''],
      MusLLPower: [''],
      MusLLReflex: [''],
      MusLLSensation: [''],
      MusRLPower: [''],
      MusRLReflex: [''],
      MusRLSensation: [''],
      MusULPower: [''],
      MusULReflex:  [''],
      MusULSensation: [''],
      MusURLPower: [''],
      MusURLReflex:  [''],
      MusURLSensation: [''],
      MusOther: ['']
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
    // console.log(physicalExam);

    this.medicalSurveillanceService.getPhysicalExamDetails(physicalExam)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((physicalExamData: any) => {
        if(physicalExamData['status'] == 200) {
            this.physicalExamDetails = physicalExamData['msPhysicalExam'];
            console.log(this.physicalExamDetails);
            
            this.physicalExamForm.patchValue({
              Id: this.physicalExamDetails.Id,
              EmployeeId: this.physicalExamDetails.EmployeeId,
              EmployeeOHSTestVisitId: this.physicalExamDetails.EmployeeOHSTestVisitId,
              Weight: +(this.physicalExamDetails.Weight),
              Height: +(this.physicalExamDetails.Height),
              BMI: +(this.physicalExamDetails.BMI),
              BPSys: +(this.physicalExamDetails.BPSys),
              BPDias: +(this.physicalExamDetails.BPDias),
              Pulse: +(this.physicalExamDetails.Pulse),
              GenAppearance: this.physicalExamDetails.GenAppearance,
        
              LeftEyeVision: this.physicalExamDetails.LeftEyeVision,
              LeftEyeVisionProblem: this.physicalExamDetails.LeftEyeVisionProblem,
              RightEyeVision: this.physicalExamDetails.RightEyeVision,
              RightEyeVisionProblem: this.physicalExamDetails.RightEyeVisionProblem,
              LeftFieldVision: this.physicalExamDetails.LeftFieldVision,
              LeftFieldVisionProblem: this.physicalExamDetails.LeftFieldVisionProblem,
              RightFieldVision: this.physicalExamDetails.RightFieldVision,
              RightFieldVisionProblem: this.physicalExamDetails.RightFieldVisionProblem,
              LeftColorVision: this.physicalExamDetails.LeftColorVision,
              LeftColorVisionProblem: this.physicalExamDetails.LeftColorVisionProblem,
              RightColorVision: this.physicalExamDetails.RightColorVision,
              RightColorVisionProblem: this.physicalExamDetails.RightColorVisionProblem,
              LeftFundoscopy: this.physicalExamDetails.LeftFundoscopy,
              LeftFundoscopyProblem: this.physicalExamDetails.LeftFundoscopyProblem,
              RightFundoscopy: this.physicalExamDetails.RightFundoscopy,
              RightFundoscopyProblem: this.physicalExamDetails.RightFundoscopyProblem,
              LeftEarCanal: this.physicalExamDetails.LeftEarCanal,
              LeftEarCanalProblem: this.physicalExamDetails.LeftEarCanalProblem,
              RightEarCanal: this.physicalExamDetails.RightEarCanal,
              RightEarCanalProblem: this.physicalExamDetails.RightEarCanalProblem,
              LeftEarDrum: this.physicalExamDetails.LeftEarDrum,
              LeftEarDrumProblem: this.physicalExamDetails.LeftEarDrumProblem,
              RightEarDrum: this.physicalExamDetails.RightEarDrum,
              RightEarDrumProblem: this.physicalExamDetails.RightEarDrumProblem,
              LeftAirConduction: this.physicalExamDetails.LeftAirConduction,
              LeftAirConductionProblem: this.physicalExamDetails.LeftAirConductionProblem,
              RightAirConduction: this.physicalExamDetails.RightAirConduction,
              RightAirConductionProblem: this.physicalExamDetails.RightAirConductionProblem,
              LeftBoneConduction: this.physicalExamDetails.LeftBoneConduction,
              LeftBoneConductionProblem: this.physicalExamDetails.LeftBoneConductionProblem,
              RightBoneConduction: this.physicalExamDetails.RightBoneConduction,
              RightBoneConductionProblem: this.physicalExamDetails.RightBoneConductionProblem,
              LeftNose: this.physicalExamDetails.LeftNose,
              LeftNoseProblem: this.physicalExamDetails.LeftNoseProblem,
              RightNose: this.physicalExamDetails.RightNose,
              RightNoseProblem: this.physicalExamDetails.RightNoseProblem,
              Throat: this.physicalExamDetails.Throat,
              ThroatProblem: this.physicalExamDetails.ThroatProblem,
              Nails: this.physicalExamDetails.Nails,
              NailsProblem: this.physicalExamDetails.NailsProblem,
              Skin: this.physicalExamDetails.Skin,
              SkinProblem: this.physicalExamDetails.SkinProblem,
              Lymphatics: this.physicalExamDetails.Lymphatics,
              LymphaticsProblem: this.physicalExamDetails.LymphaticsProblem,
              VericoseVein: this.physicalExamDetails.VericoseVein,
              VericoseVeinProblem: this.physicalExamDetails.VericoseVeinProblem,
              CNSOrientation: this.physicalExamDetails.CNSOrientation,
              CNSOrientationProblem: this.physicalExamDetails.CNSOrientationProblem,
              CNSPlacePerson: this.physicalExamDetails.CNSPlacePerson,
              CNSPlacePersonProblem: this.physicalExamDetails.CNSPlacePersonProblem,
              CNSOther: this.physicalExamDetails.CNSOther,
              CNSOtherProblem: this.physicalExamDetails.CNSOtherProblem,
              CVSdrnm: this.physicalExamDetails.CVSdrnm,
              CVSdrnmProblem: this.physicalExamDetails.CVSdrnmProblem,
              CVSOther: this.physicalExamDetails.CVSOther,
              CVSOtherProblem: this.physicalExamDetails.CVSOtherProblem,
        
              RSChestExpension: this.physicalExamDetails.RSChestExpension,
              RSAirEntry: this.physicalExamDetails.RSAirEntry,
              RSCrepitations: this.physicalExamDetails.RSCrepitations,
              RSWheeze: this.physicalExamDetails.RSWheeze,
              RSOthers: this.physicalExamDetails.RSOthers,
              GSLiver: this.physicalExamDetails.GSLiver,
              GSSpleen: this.physicalExamDetails.GSSpleen,
              GSAbdomen: this.physicalExamDetails.GSAbdomen,
              GSOthers: this.physicalExamDetails.GSOthers,
              GenKidney: this.physicalExamDetails.GenKidney,
              GenBladder: this.physicalExamDetails.GenBladder,
              GenUterus: this.physicalExamDetails.GenUterus,
              GenOthers: this.physicalExamDetails.GenOthers,
              MusLLPower: this.physicalExamDetails.MusLLPower,
              MusLLReflex: this.physicalExamDetails.MusLLReflex,
              MusLLSensation: this.physicalExamDetails.MusLLSensation,
              MusRLPower: this.physicalExamDetails.MusRLPower,
              MusRLReflex: this.physicalExamDetails.MusRLReflex,
              MusRLSensation: this.physicalExamDetails.MusRLSensation,
              MusULPower: this.physicalExamDetails.MusULPower,
              MusULReflex:  this.physicalExamDetails.MusULReflex,
              MusULSensation: this.physicalExamDetails.MusULSensation,
              MusURLPower: this.physicalExamDetails.MusURLPower,
              MusURLReflex:  this.physicalExamDetails.MusURLReflex,
              MusURLSensation: this.physicalExamDetails.MusURLSensation,
              MusOther: this.physicalExamDetails.MusOther
            });
            this.calculateEmployeeBmi();
            this.calculateBloodPressure();
        }
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
  clearInput(ipField: string){
    console.log(ipField);
    // if((ipField === 'OtherSpecify') || (ipField === 'Immunization') || (ipField === 'Other')) {
    //   this.formControls[ipField].reset();
    //   this.formControls[ipField].clearValidators();
    // } else if(ipField) {
    // this.formControls[ipField].reset();
    // this.formControls[ipField].setValidators(Validators.required);
    // } else {
    //   this.formControls[ipField].clearValidators();
    // }
    // this.formControls[ipField].updateValueAndValidity();

    if(ipField) {
      this.formControls[ipField].reset();
      this.formControls[ipField].clearValidators();
    }
    this.formControls[ipField].updateValueAndValidity();
  }

  onSubmit() {
    this.physicalExamForm.markAllAsTouched();
    console.log(this.physicalExamForm);

    if (this.physicalExamForm.valid) {
      const physicalExamDataPayLoad = {
        msPhysicalExam: {
          ...this.physicalExamForm.value
        }
      }
      console.log(physicalExamDataPayLoad);

      this.medicalSurveillanceService.addEditPhysicalExam(physicalExamDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        console.log(response);
        if (response['status'] == 200) {
          if (this.physicalExamForm.value.Id > 0) {
            this.snackBar.open('Updated Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getPhysicalExamDetails();
            this.updateNext = true;
          } else {
            this.snackBar.open('Saved Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getPhysicalExamDetails();
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
