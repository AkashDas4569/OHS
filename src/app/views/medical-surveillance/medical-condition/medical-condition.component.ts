import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, MedicalSurveillanceService, EmployeeService } from '../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ohs-medical-condition',
  templateUrl: './medical-condition.component.html',
  styleUrls: ['./medical-condition.component.scss']
})
export class MedicalConditionComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public medicalConditionForm!: FormGroup;

  public employeeId: number = 0;
  public doctorId: number = 0;
  // public gender: string = '';
  public employeeTestVisitId: number = 0;
  public medicalConditionDetails: any;
  public employeeDetailsForMC: any = {};
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
      // this.gender = params['sex'];

      console.log('employeeId: ', this.employeeId);
      console.log('doctorId: ', this.doctorId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
      // console.log('Gender: ', this.gender);
    });


    this.medicalConditionForm = this.fb.group({
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      OHDoctorId: ['', Validators.required],
      Gender: ['', Validators.required],
      SmokingId: [0],
      MsMedConId: [0],
      MSMensesHistoryId: [0],
      Smoker: [false],
      // Smoker: [''],
      NonSmoker: [false],
      StoppedSmoking: [false],
      NoYearsSmoked: ['', Validators.pattern(/^[0-9]*$/)],
      NoOfCigaratesPerDay: ['', Validators.pattern(/^[0-9]*$/)],
      EyeProblem: ['', Validators.required],
      SpecifyEyeProblem: [''],
      Fits: ['', Validators.required],
      SpecifyFits: [''],
      HeadInjury: ['', Validators.required],
      SpecifyHeadInjury: [''],
      Giddiness: ['', Validators.required],
      SpeicyGiddiness: [''],
      Fainting: ['', Validators.required],
      SpecifyFainting: [''],
      BrainSurgery: ['', Validators.required],
      SpecifyBrainSurgery: [''],
      Stroke: ['', Validators.required],
      SpecifyStroke: [''],
      Diabetes: ['', Validators.required],
      SpecifyDiabetes: [''],
      MentalIllness: ['', Validators.required],
      SpecifyMentalIllness: [''],
      Alcohol: ['', Validators.required],
      SpecifyAlcohol: [''],
      Drugs: ['', Validators.required],
      SpecifyDrugs: [''],
      Spine: ['', Validators.required],
      SpecifySpine: [''],
      Hypertension: ['', Validators.required],
      SpecifyHypertension: [''],
      Cough: ['', Validators.required],
      SpecifyCough: [''],
      Hearing: ['', Validators.required],
      SpecifyHearing: [''],
      kidney: ['', Validators.required],
      SpecifyKidney: [''],
      RegMeds: ['', Validators.required],
      SpecifyRegMeds: [''],
      OtherIllness: ['', Validators.required],
      SpecifyOtherIllness: [''],

      AgeOfMenarche: [''],
      RegularMenses: [''],
      NoOfAbortion: [''],
      SpecifyAbortion: [''],
      NoOfStillBirth: [''],
      SpecifyStillBirth: [''],
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.OHDoctorId.setValue(this.doctorId);
    // this.formControls.Gender.setValue(this.gender);

    this.getEmployeeById();
    this.getMedicalConditionDetails();
  }

  get formControls() {
    return this.medicalConditionForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  valueToggle(name: string) {
    // this.formControls.Smoker.value != this.formControls.NonSmoker.value
   if(name === 'Smoker') {
     this.formControls.Smoker.setValue(true);
    this.formControls.NonSmoker.setValue(false);
   }
   if(name === 'NonSmoker') {
    this.formControls.NonSmoker.setValue(true);
    this.formControls.Smoker.setValue(false);
   }
  }
  getEmployeeById() {
    this.employeeService.getEmployeeById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        this.employeeDetailsForMC = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForMC);
        this.formControls.Gender.setValue(this.employeeDetailsForMC.Gender);
      });
  }
  getMedicalConditionDetails() {
    const medicalConditionDataPayLoad = {
      employeeID: this.medicalConditionForm.value.EmployeeId,
      employeeOHSTestVisitId: this.medicalConditionForm.value.EmployeeOHSTestVisitId
    }
    // console.log(medicalConditionDataPayLoad);


    this.medicalSurveillanceService.getMedicalConditionDetails(medicalConditionDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalConditionData: any) => {
        if (medicalConditionData['status'] == 200) {
          this.medicalConditionDetails = medicalConditionData['msMedCond'];
          console.log(this.medicalConditionDetails);

          this.medicalConditionForm.patchValue({
            EmployeeId: this.medicalConditionDetails.EmployeeId,
            EmployeeOHSTestVisitId: this.medicalConditionDetails.EmployeeOHSTestVisitId,
            OHDoctorId: this.medicalConditionDetails.OHDoctorId,
            // Gender: this.gender,
            SmokingId: this.medicalConditionDetails.SmokingId,
            MsMedConId: this.medicalConditionDetails.MsMedConId,
            MSMensesHistoryId: this.medicalConditionDetails.MSMensesHistoryId,
            Smoker: this.medicalConditionDetails.Smoker,
            NonSmoker: this.medicalConditionDetails.NonSmoker,
            StoppedSmoking: this.medicalConditionDetails.StoppedSmoking,
            NoYearsSmoked: this.medicalConditionDetails.NoYearsSmoked,
            NoOfCigaratesPerDay: this.medicalConditionDetails.NoOfCigaratesPerDay,
            EyeProblem: this.medicalConditionDetails.EyeProblem,
            SpecifyEyeProblem: this.medicalConditionDetails.SpecifyEyeProblem,
            Fits: this.medicalConditionDetails.Fits,
            SpecifyFits: this.medicalConditionDetails.SpecifyFits,
            HeadInjury: this.medicalConditionDetails.HeadInjury,
            SpecifyHeadInjury: this.medicalConditionDetails.SpecifyHeadInjury,
            Giddiness: this.medicalConditionDetails.Giddiness,
            SpeicyGiddiness: this.medicalConditionDetails.SpeicyGiddiness,
            Fainting: this.medicalConditionDetails.Fainting,
            SpecifyFainting: this.medicalConditionDetails.SpecifyFainting,
            BrainSurgery: this.medicalConditionDetails.BrainSurgery,
            SpecifyBrainSurgery: this.medicalConditionDetails.SpecifyBrainSurgery,
            Stroke: this.medicalConditionDetails.Stroke,
            SpecifyStroke: this.medicalConditionDetails.SpecifyStroke,
            Diabetes: this.medicalConditionDetails.Diabetes,
            SpecifyDiabetes: this.medicalConditionDetails.SpecifyDiabetes,
            MentalIllness: this.medicalConditionDetails.MentalIllness,
            SpecifyMentalIllness: this.medicalConditionDetails.SpecifyMentalIllness,
            Alcohol: this.medicalConditionDetails.Alcohol,
            SpecifyAlcohol: this.medicalConditionDetails.SpecifyAlcohol,
            Drugs: this.medicalConditionDetails.Drugs,
            SpecifyDrugs: this.medicalConditionDetails.SpecifyDrugs,
            Spine: this.medicalConditionDetails.Spine,
            SpecifySpine: this.medicalConditionDetails.SpecifySpine,
            Hypertension: this.medicalConditionDetails.Hypertension,
            SpecifyHypertension: this.medicalConditionDetails.SpecifyHypertension,
            Cough: this.medicalConditionDetails.Cough,
            SpecifyCough: this.medicalConditionDetails.SpecifyCough,
            Hearing: this.medicalConditionDetails.Hearing,
            SpecifyHearing: this.medicalConditionDetails.SpecifyHearing,
            kidney: this.medicalConditionDetails.kidney,
            SpecifyKidney: this.medicalConditionDetails.SpecifyKidney,
            RegMeds: this.medicalConditionDetails.RegMeds,
            SpecifyRegMeds: this.medicalConditionDetails.SpecifyRegMeds,
            OtherIllness: this.medicalConditionDetails.OtherIllness,
            SpecifyOtherIllness: this.medicalConditionDetails.SpecifyOtherIllness,

            AgeOfMenarche: this.medicalConditionDetails.AgeOfMenarche,
            RegularMenses: this.medicalConditionDetails.RegularMenses,
            NoOfAbortion: this.medicalConditionDetails.NoOfAbortion,
            SpecifyAbortion: this.medicalConditionDetails.SpecifyAbortion,
            NoOfStillBirth: this.medicalConditionDetails.NoOfStillBirth,
            SpecifyStillBirth: this.medicalConditionDetails.SpecifyStillBirth,
          });
        }
      });
  }

  onSelectChange(radioBtn: string, ipField: string) {
    console.log(radioBtn);
    console.log(ipField);

    if (!this.formControls[radioBtn].value) {
      this.formControls[ipField].reset();
      this.formControls[ipField].clearValidators();
    } else {
      this.formControls[ipField].setValidators(Validators.required);
    }
    this.formControls[ipField].updateValueAndValidity();
  }
  clearInput(ipField: string) {
    console.log(ipField);
    if (ipField) {
      this.formControls[ipField].reset();
      this.formControls[ipField].setValidators(Validators.required);
    } else {
      this.formControls[ipField].clearValidators();
    }
    this.formControls[ipField].updateValueAndValidity();
  }

  onSubmit() {
    this.medicalConditionForm.markAllAsTouched();
    console.log(this.medicalConditionForm);

    if (this.medicalConditionForm.valid) {
      const medicalConditionDataPayLoad = {
        msMedCond: {
          ...this.medicalConditionForm.value
        }
      }
      console.log(medicalConditionDataPayLoad);

      this.medicalSurveillanceService.addEditMedicalCondititon(medicalConditionDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          console.log(response);
          if (response['status'] == 200) {
            if ((this.medicalConditionForm.value.SmokingId > 0 && this.medicalConditionForm.value.MsMedConId)) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getMedicalConditionDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getMedicalConditionDetails();
              this.saveNext = true;
            }
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    } else {
      this.snackBar.open('All Fields are required before Saving! Please try again.', 'Close', {
        panelClass: 'error-popup',
      });
    }
  }
}
