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
  selector: 'ohs-family-history',
  templateUrl: './family-history.component.html',
  styleUrls: ['./family-history.component.scss']
})
export class FamilyHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public familyHistoryForm!: FormGroup;

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public familyHistoryDetails: any;
  public employeeDetailsForFH: any = {};
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

      console.log('employeeId: ', this.employeeId);
      console.log('doctorId: ', this.doctorId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
    });

    this.familyHistoryForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      UpdateOHDoctorId: ['', Validators.required],
      OHDoctorId: ['', Validators.required],
      MedicalIllness: [''],
      SpecifyMedicalIllness: [''],
      Allergy: [''],
      SpecifyAllergy: [''],
      Congential: [''],
      SpecifyCongential: [''],
      OtherIllness: [''],
      SpecifyOtherIllness: ['']
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.UpdateOHDoctorId.setValue(this.doctorId);
    this.formControls.OHDoctorId.setValue(this.doctorId);

    this.getEmployeeById();
    this.getFamilyHistoryDetails();
  }

  get formControls() {
    return this.familyHistoryForm.controls;
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
        this.employeeDetailsForFH = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForFH);
      });
  }
  getFamilyHistoryDetails() {
    const familyHistory = {
      employeeID: this.familyHistoryForm.value.EmployeeId,
    }
    // console.log(familyHistory);

    this.medicalSurveillanceService.getFamilyHistoryDetails(familyHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((familyHistoryData: any) => {
        if (familyHistoryData['status'] == 200) {
          this.familyHistoryDetails = familyHistoryData['familyHistory'];
          console.log(this.familyHistoryDetails);

          this.familyHistoryForm.patchValue({
            Id: this.familyHistoryDetails.Id,
            EmployeeId: this.familyHistoryDetails.EmployeeId,
            OHDoctorId: this.familyHistoryForm.value.OHDoctorId,
            UpdateOHDoctorId: this.familyHistoryForm.value.UpdateOHDoctorId,
            MedicalIllness: this.familyHistoryDetails.MedicalIllness,
            SpecifyMedicalIllness: this.familyHistoryDetails.SpecifyMedicalIllness,
            Allergy: this.familyHistoryDetails.Allergy,
            SpecifyAllergy: this.familyHistoryDetails.SpecifyAllergy,
            Congential: this.familyHistoryDetails.Congential,
            SpecifyCongential: this.familyHistoryDetails.SpecifyCongential,
            OtherIllness: this.familyHistoryDetails.OtherIllness,
            SpecifyOtherIllness: this.familyHistoryDetails.SpecifyOtherIllness
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
    this.familyHistoryForm.markAllAsTouched();
    console.log(this.familyHistoryForm);

    if (this.familyHistoryForm.valid) {
      const familyHistoryDataPayLoad = {
        familyHistory: {
          ...this.familyHistoryForm.value
        }
      }
      console.log(familyHistoryDataPayLoad);

      this.medicalSurveillanceService.addEditFamilyHistory(familyHistoryDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          console.log(response);
          if (response['status'] == 200) {
            if (this.familyHistoryForm.value.Id > 0) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getFamilyHistoryDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getFamilyHistoryDetails();
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
