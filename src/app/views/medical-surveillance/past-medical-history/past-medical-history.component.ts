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
  selector: 'ohs-past-medical-history',
  templateUrl: './past-medical-history.component.html',
  styleUrls: ['./past-medical-history.component.scss']
})
export class PastMedicalHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public pastMedicalHistoryForm!: FormGroup;

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public pastMedicalHistoryDetails: any;
  public employeeDetailsForPMH: any = {};
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
   
    this.pastMedicalHistoryForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      OHDoctorId: ['', Validators.required],
      CNS: ['', Validators.required],
      SpecifyCNS: [''],
      PNS: ['', Validators.required],
      SpecifyPNS: [''],
      CVS: ['', Validators.required],
      SpecifyCVS: [''],
      RESPsys: ['', Validators.required],
      SpecifyRESPsys: [''],
      Gastro: ['', Validators.required],
      SpecifyGastro: [''],
      MuscSke: ['', Validators.required],
      SpecifyMuscSke: [''],
      Endocrine: ['', Validators.required],
      SpecifyEndocrine: [''],
      Genitourinary: ['', Validators.required],
      SpecifyGenitourinary: [''],
      Reproductive: ['', Validators.required],
      SpecifyReproductive: [''],
      Allergy: ['', Validators.required],
      SpecifyAllergy: [''],
      Hospitalization: ['', Validators.required],
      SpecifyHospitalization: [''],
      PrevInjury: ['', Validators.required],
      SpecifyPrevInjury: [''],
      Compensation: ['', Validators.required],
      SpecifyCompensation: [''],
      CoWorkers: ['', Validators.required],
      SpecifyCoWorkers: [''],
      OtherProblems: ['', Validators.required],
      SpecifyOtherProblems: ['']
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.OHDoctorId.setValue(this.doctorId);

    this.getEmployeeById();
    this.getPastMedicalHistoryDetails();
  }
  ngAfterViewInit(): void {
    // this.onSelectChange(this.pastMedicalHistoryDetails);
  }

  get formControls() {
    return this.pastMedicalHistoryForm.controls;
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
        this.employeeDetailsForPMH = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForMC);
    });
  }
  getPastMedicalHistoryDetails() {
    const pastMedicalHistory = {
      employeeID: this.pastMedicalHistoryForm.value.EmployeeId,
      employeeOHSTestVisitId: this.pastMedicalHistoryForm.value.EmployeeOHSTestVisitId
    }
    // console.log(pastMedicalHistory);

    this.medicalSurveillanceService.getPastMedicalHistoryDetails(pastMedicalHistory)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((pastMedicalHistoryData: any) => {
      if(pastMedicalHistoryData['status'] == 200) {
      this.pastMedicalHistoryDetails = pastMedicalHistoryData['msPastMedHistory'];
      console.log(this.pastMedicalHistoryDetails);

      this.pastMedicalHistoryForm.patchValue({
        Id: this.pastMedicalHistoryDetails.Id,
        EmployeeId: this.pastMedicalHistoryDetails.EmployeeId,
        EmployeeOHSTestVisitId: this.pastMedicalHistoryDetails.EmployeeOHSTestVisitId,
        OHDoctorId: this.pastMedicalHistoryDetails.OHDoctorId,
        CNS: this.pastMedicalHistoryDetails.CNS,
        SpecifyCNS: this.pastMedicalHistoryDetails.SpecifyCNS,
        PNS: this.pastMedicalHistoryDetails.PNS,
        SpecifyPNS: this.pastMedicalHistoryDetails.SpecifyPNS,
        CVS: this.pastMedicalHistoryDetails.CVS,
        SpecifyCVS: this.pastMedicalHistoryDetails.SpecifyCVS,
        RESPsys: this.pastMedicalHistoryDetails.RESPsys,
        SpecifyRESPsys: this.pastMedicalHistoryDetails.SpecifyRESPsys,
        Gastro: this.pastMedicalHistoryDetails.Gastro,
        SpecifyGastro: this.pastMedicalHistoryDetails.SpecifyGastro,
        MuscSke: this.pastMedicalHistoryDetails.MuscSke,
        SpecifyMuscSke: this.pastMedicalHistoryDetails.SpecifyMuscSke,
        Endocrine: this.pastMedicalHistoryDetails.Endocrine,
        SpecifyEndocrine: this.pastMedicalHistoryDetails.SpecifyEndocrine,
        Genitourinary: this.pastMedicalHistoryDetails.Genitourinary,
        SpecifyGenitourinary: this.pastMedicalHistoryDetails.SpecifyGenitourinary,
        Reproductive: this.pastMedicalHistoryDetails.Reproductive,
        SpecifyReproductive: this.pastMedicalHistoryDetails.SpecifyReproductive,
        Allergy: this.pastMedicalHistoryDetails.Allergy,
        SpecifyAllergy: this.pastMedicalHistoryDetails.SpecifyAllergy,
        Hospitalization: this.pastMedicalHistoryDetails.Hospitalization,
        SpecifyHospitalization: this.pastMedicalHistoryDetails.SpecifyHospitalization,
        PrevInjury: this.pastMedicalHistoryDetails.PrevInjury,
        SpecifyPrevInjury: this.pastMedicalHistoryDetails.SpecifyPrevInjury,
        Compensation: this.pastMedicalHistoryDetails.Compensation,
        SpecifyCompensation: this.pastMedicalHistoryDetails.SpecifyCompensation,
        CoWorkers: this.pastMedicalHistoryDetails.CoWorkers,
        SpecifyCoWorkers: this.pastMedicalHistoryDetails.SpecifyCoWorkers,
        OtherProblems: this.pastMedicalHistoryDetails.OtherProblems,
        SpecifyOtherProblems: this.pastMedicalHistoryDetails.SpecifyOtherProblems,
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
    this.pastMedicalHistoryForm.markAllAsTouched();
    console.log(this.pastMedicalHistoryForm);
    
    if(this.pastMedicalHistoryForm.valid) {
      const pastMedicalHistoryDataPayLoad = {
        msPastMedHistory: {
          ...this.pastMedicalHistoryForm.value
        }
      }
      console.log(pastMedicalHistoryDataPayLoad);

      this.medicalSurveillanceService.addEditPastMedicalHistory(pastMedicalHistoryDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        console.log(response);
        if(response['status'] == 200) {
          if(this.pastMedicalHistoryForm.value.Id > 0) {
            this.snackBar.open('Updated Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getPastMedicalHistoryDetails();
            this.updateNext = true;
          } else {
            this.snackBar.open('Saved Successfully', 'Close', {
              panelClass: 'success-popup',
            });

            this.getPastMedicalHistoryDetails();
            this.saveNext = true;
          }
        }else {
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
