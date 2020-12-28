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
  selector: 'ohs-occupational-noise-exposure',
  templateUrl: './occupational-noise-exposure.component.html',
  styleUrls: ['./occupational-noise-exposure.component.scss']
})
export class OccupationalNoiseExposureComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public occupationalNoiseForm!: FormGroup;

  public employeeId: number = 0;
  // public doctorId: number = 0;
  public userId: number = 0;
  public employeeTestVisitId: number = 0;
  public occupationalNoiseDetails: any;
  public employeeDetailsForONE: any = {};
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
    private routeService: RouteService
  ) { }

  ngOnInit(): void {
    // this.routeService.getRouteParamForAudiometricData()
    // // .pipe(takeUntil(this.onDestroyUnSubscribe))
    // .subscribe((routeParams: any) => {
    //   console.log('Service Data: ', routeParams);
    // });

    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];
      // this.doctorId = +params['dId'];

      // console.log('employeeId: ', this.employeeId);
      // console.log('employeeTestVisitId: ', this.employeeTestVisitId);
      // console.log('doctorId: ', this.doctorId);
    });
    this.userId = Number(this.authenticationService.getUserLoggedInID());
    // console.log(this.userId);

    this.occupationalNoiseForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      UserIDEntered: ['', Validators.required],
      ExceedNoiseExpo: ['', Validators.required],
      ExpoLoudPreEmp: ['', Validators.required],
      ExpoLoudCurEmp: ['', Validators.required],
      ExpoLoudPart: ['', Validators.required],
      ProtectPreEmp: ['', Validators.required],
      ProtectCurEmp: ['', Validators.required],
      ProtectPart: ['', Validators.required],
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.UserIDEntered.setValue(this.userId);

    this.getEmployeeById();
    this.getOccupationalNoiseExposureDetails();
  }

  get formControls() {
    return this.occupationalNoiseForm.controls;
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
        this.employeeDetailsForONE = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForFH);
      });
  }
  getOccupationalNoiseExposureDetails() {
    const occupationalNoiseExposure = {
      employeeID: this.occupationalNoiseForm.value.EmployeeId,
      employeeOHSTestVisitId: this.occupationalNoiseForm.value.EmployeeOHSTestVisitId
    }
    // console.log(occupationalNoiseExposure);

    this.audiometricService.getOccupationalNoiseExposureDetails(occupationalNoiseExposure)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((occupationalNoiseExposureData: any) => {
        if (occupationalNoiseExposureData['status'] == 200) {
          this.occupationalNoiseDetails = occupationalNoiseExposureData['occupationalNoiseExpo'];
          // console.log(this.occupationalNoiseDetails);

          this.occupationalNoiseForm.patchValue({
            Id: this.occupationalNoiseDetails.Id,
            EmployeeId: this.occupationalNoiseDetails.EmployeeId,
            EmployeeOHSTestVisitId: this.occupationalNoiseDetails.EmployeeOHSTestVisitId,
            UserIDEntered: +(this.occupationalNoiseDetails.UserIDEntered),
            ExceedNoiseExpo: this.occupationalNoiseDetails.ExceedNoiseExpo,
            ExpoLoudPreEmp: this.occupationalNoiseDetails.ExpoLoudPreEmp,
            ExpoLoudCurEmp: this.occupationalNoiseDetails.ExpoLoudCurEmp,
            ExpoLoudPart: this.occupationalNoiseDetails.ExpoLoudPart,
            ProtectPreEmp: this.occupationalNoiseDetails.ProtectPreEmp,
            ProtectCurEmp: this.occupationalNoiseDetails.ProtectCurEmp,
            ProtectPart: this.occupationalNoiseDetails.ProtectPart,
          });
        }
      })
  }
  onSubmit() {
    this.occupationalNoiseForm.markAllAsTouched();
    // console.log(this.occupationalNoiseForm);

    if (this.occupationalNoiseForm.valid) {
      const occupationalNoiseExposureDataPayLoad = {
        occupationalNoiseExpo: {
          ...this.occupationalNoiseForm.value
        }
      }
      // console.log(occupationalNoiseExposureDataPayLoad);

      this.audiometricService.addEditOccupationalNoiseExposure(occupationalNoiseExposureDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            if (this.occupationalNoiseForm.value.Id > 0) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getOccupationalNoiseExposureDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getOccupationalNoiseExposureDetails();
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
