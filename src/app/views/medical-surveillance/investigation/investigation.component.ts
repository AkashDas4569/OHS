import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'ohs-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss']
})
export class InvestigationComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public investigationForm!: FormGroup;

  public employeeId: number = 0;
  // public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public investigationDetails: any;
  public employeeDetailsForinv: any = {};
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

    this.investigationForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      LabTestCategory: [null],
      FEME: [''],
      FemeSpecify: [''],
      Hb: [''],
      HbSpecify: [''],
      BUSE: [''],
      BUSEspecify: [''],
      RenalProfile: [''],
      RenalProfileSpecify: [''],
      LiverFn: [''],
      LiverFnSpecify: [''],
      OtherSpecify: [''],
      Sputum: [''],
      SputumSpecify: [''],
      CXR: [''],
      CXRSpecify: [''],
      FVC: [''],
      FVCspecify: [''],
      FEV1: [''],
      FEV1specify: [''],
      FEV1_FVC: [''],
      FEV1_FVCspecify: [''],
      Audigram: [''],
      AudigramSpecify: [''],
      Immunization: [''],
      Other: [''],
      // DateEntered: ['']
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);

    this.getEmployeeById();
    this.getInvestigationDetails();
  }

  get formControls() {
    return this.investigationForm.controls;
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
        this.employeeDetailsForinv = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForPE);
      });
  }
  getInvestigationDetails() {
    const investigation = {
      employeeID: this.investigationForm.value.EmployeeId,
      employeeOHSTestVisitId: this.investigationForm.value.EmployeeOHSTestVisitId
    }
    // console.log(investigation);

    this.medicalSurveillanceService.getInvestigationDetails(investigation)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((investigationData: any) => {
        console.log(investigationData);
        if (investigationData['status'] == 200) {
          this.investigationDetails = investigationData['labInvestigation'];
          console.log(this.investigationDetails);

          this.investigationForm.patchValue({
            Id: this.investigationDetails.Id,
            EmployeeId: this.investigationDetails.EmployeeId,
            EmployeeOHSTestVisitId: this.investigationDetails.EmployeeOHSTestVisitId,
            LabTestCategory: this.investigationDetails.LabTestCategory,
            FEME: this.investigationDetails.FEME,
            FemeSpecify: this.investigationDetails.FemeSpecify,
            Hb: this.investigationDetails.Hb,
            HbSpecify: this.investigationDetails.HbSpecify,
            BUSE: this.investigationDetails.BUSE,
            BUSEspecify: this.investigationDetails.BUSEspecify,
            RenalProfile: this.investigationDetails.RenalProfile,
            RenalProfileSpecify: this.investigationDetails.RenalProfileSpecify,
            LiverFn: this.investigationDetails.LiverFn,
            LiverFnSpecify: this.investigationDetails.LiverFnSpecify,
            OtherSpecify: this.investigationDetails.OtherSpecify,
            Sputum: this.investigationDetails.Sputum,
            SputumSpecify: this.investigationDetails.SputumSpecify,
            CXR: this.investigationDetails.CXR,
            CXRSpecify: this.investigationDetails.CXRSpecify,
            FVC: this.investigationDetails.FVC,
            FVCspecify: this.investigationDetails.FVCspecify,
            FEV1: this.investigationDetails.FEV1,
            FEV1specify: this.investigationDetails.FEV1specify,
            FEV1_FVC: this.investigationDetails.FEV1_FVC,
            FEV1_FVCspecify: this.investigationDetails.FEV1_FVCspecify,
            Audigram: this.investigationDetails.Audigram,
            AudigramSpecify: this.investigationDetails.AudigramSpecify,
            Immunization: this.investigationDetails.Immunization,
            Other: this.investigationDetails.Other,
            // DateEntered: this.investigationDetails.DateEntered
          });
        }
      });
  }
  clearInput(ipField: string){
    console.log(ipField);
    if((ipField === 'OtherSpecify') || (ipField === 'Immunization') || (ipField === 'Other')) {
      this.formControls[ipField].reset();
      this.formControls[ipField].clearValidators();
    } else if(ipField) {
    this.formControls[ipField].reset();
    this.formControls[ipField].setValidators(Validators.required);
    } else {
      this.formControls[ipField].clearValidators();
    }
    this.formControls[ipField].updateValueAndValidity();
  }

  onSubmit() {
    this.investigationForm.markAllAsTouched();
    console.log(this.investigationForm);

    if (this.investigationForm.valid) {
      const investigationDataPayLoad = {
        labInvestigation: {
          ...this.investigationForm.value
        }
      }
      console.log(investigationDataPayLoad);

      this.medicalSurveillanceService.addEditInvestigation(investigationDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        console.log(response);
        if (response['status'] == 200) {
          if (this.investigationForm.value.Id > 0) {
            this.snackBar.open('Updated Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getInvestigationDetails();
            this.updateNext = true;
          } else {
            this.snackBar.open('Saved Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getInvestigationDetails();
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
