import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AudiometricService, EmployeeService, RouteService } from '../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ohs-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public medicalHistoryForm!: FormGroup;

  public employeeId: number = 0;
  // public doctorId: number = 0;
  public userId: number = 0;
  public employeeTestVisitId: number = 0;
  public medicalHistoryDetails: any;
  public employeeDetailsForMH: any = {};
  public saveNext: boolean = false;
  public updateNext: boolean = true;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private employeeService: EmployeeService,
    private audiometricService: AudiometricService,
    // private routeService: RouteService
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
    this.userId = Number(this.authenticationService.getUserLoggedInID());
    console.log(this.userId);

    this.medicalHistoryForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      UserIDEntered: ['', Validators.required],
      InjuryHistory: [''],
      URTIsymptoms: [''],
      BuzzHistory: [''],
      DiseaseAffect: [''],
      CertHearingLoss: [''],
      Antibiotics: [''],
      LoudNoiseHobby: [''],
      scubaDiving: [''],
      ExpoExplosion: [''],
      Expo14hoursPrior: [''],
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.UserIDEntered.setValue(this.userId);

    this.getEmployeeById();
    this.getMedicalHistoryDetails();
  }

  get formControls() {
    return this.medicalHistoryForm.controls;
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
        this.employeeDetailsForMH = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForFH);
      });
  }
  getMedicalHistoryDetails() {
    const medicalHistory = {
      employeeID: this.medicalHistoryForm.value.EmployeeId,
      employeeOHSTestVisitId: this.medicalHistoryForm.value.EmployeeOHSTestVisitId
    }
    // console.log(medicalHistory);

    this.audiometricService.getMedicalHistoryDetails(medicalHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalHistoryData: any) => {
        if (medicalHistoryData['status'] == 200) {
          this.medicalHistoryDetails = medicalHistoryData['auMedHistory'];
          console.log(this.medicalHistoryDetails);

          this.medicalHistoryForm.patchValue({
            Id: this.medicalHistoryDetails.Id,
            EmployeeId: this.medicalHistoryDetails.EmployeeId,
            EmployeeOHSTestVisitId: this.medicalHistoryDetails.EmployeeOHSTestVisitId,
            UserIDEntered: +(this.medicalHistoryDetails.UserIDEntered),
            InjuryHistory: this.medicalHistoryDetails.InjuryHistory,
            URTIsymptoms: this.medicalHistoryDetails.URTIsymptoms,
            BuzzHistory: this.medicalHistoryDetails.BuzzHistory,
            DiseaseAffect: this.medicalHistoryDetails.DiseaseAffect,
            CertHearingLoss: this.medicalHistoryDetails.CertHearingLoss,
            Antibiotics: this.medicalHistoryDetails.Antibiotics,
            LoudNoiseHobby: this.medicalHistoryDetails.LoudNoiseHobby,
            scubaDiving: this.medicalHistoryDetails.scubaDiving,
            ExpoExplosion: this.medicalHistoryDetails.ExpoExplosion,
            Expo14hoursPrior: this.medicalHistoryDetails.Expo14hoursPrior
          });
        }
      });
    }
  onSubmit() {
    this.medicalHistoryForm.markAllAsTouched();
    console.log(this.medicalHistoryForm);

    if (this.medicalHistoryForm.valid) {
      const medicalHistoryDataPayLoad = {
        auMedHistory: {
          ...this.medicalHistoryForm.value
        }
      }
      console.log(medicalHistoryDataPayLoad);

      this.audiometricService.addEditMedicalHistory(medicalHistoryDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            if (this.medicalHistoryForm.value.Id > 0) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getMedicalHistoryDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getMedicalHistoryDetails();
              this.saveNext = true;
            }
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    }
  }
}
