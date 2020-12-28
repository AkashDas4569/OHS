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
  selector: 'ohs-chemical-history',
  templateUrl: './chemical-history.component.html',
  styleUrls: ['./chemical-history.component.scss']
})
export class ChemicalHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public chemicalHistoryForm!: FormGroup;

  public date = new Date().toISOString();
  public maxDate = moment();
  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public chemicalHistoryDetails: any;
  public employeeDetailsForCH: any = {};
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

    this.chemicalHistoryForm = this.fb.group({
      Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      OHDoctorId: ['', Validators.required],
      Trained: ['', Validators.required],
      SpecifyTrained: [''],
      Symptoms: ['', Validators.required],
      SpecifySymptoms: [''],
      SymptomsDate: [''],
      PPEApproved: ['', Validators.required],
      SpecifyPPEApproved: [''],
      Exposure: ['', Validators.required],
      ExposureAvg: [''],
      MaxExposureLimit: [''],
      WorkplaceMonitor: [''],
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.OHDoctorId.setValue(this.doctorId);

    this.getEmployeeById();
    this.getChemicalHistoryDetails();
  }

  get formControls() {
    return this.chemicalHistoryForm.controls;
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
        this.employeeDetailsForCH = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForCH);
      });
  }
  getChemicalHistoryDetails() {
    const chemicalHistory = {
      employeeID: this.chemicalHistoryForm.value.EmployeeId,
      employeeOHSTestVisitId: this.chemicalHistoryForm.value.EmployeeOHSTestVisitId
    }
    // console.log(chemicalHistory);

    this.medicalSurveillanceService.getChemicalHistoryDetails(chemicalHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((chemicalHistoryData: any) => {
        if (chemicalHistoryData['status'] == 200) {
          this.chemicalHistoryDetails = chemicalHistoryData['msChemicalHistory'];
          // console.log(this.chemicalHistoryDetails);

          this.chemicalHistoryForm.patchValue({
            Id: this.chemicalHistoryDetails.Id,
            EmployeeId: this.chemicalHistoryDetails.EmployeeId,
            OHDoctorId: this.chemicalHistoryDetails.OHDoctorId,
            EmployeeOHSTestVisitId: this.chemicalHistoryDetails.EmployeeOHSTestVisitId,
            Trained: this.chemicalHistoryDetails.Trained,
            SpecifyTrained: this.chemicalHistoryDetails.SpecifyTrained,
            Symptoms: this.chemicalHistoryDetails.Symptoms,
            SpecifySymptoms: this.chemicalHistoryDetails.SpecifySymptoms,
            SymptomsDate: moment(this.chemicalHistoryDetails.SymptomsDateStr, 'DD/MM/YYYY'),
            PPEApproved: this.chemicalHistoryDetails.PPEApproved,
            SpecifyPPEApproved: this.chemicalHistoryDetails.SpecifyPPEApproved,
            Exposure: this.chemicalHistoryDetails.Exposure,
            ExposureAvg: this.chemicalHistoryDetails.ExposureAvg,
            MaxExposureLimit: this.chemicalHistoryDetails.MaxExposureLimit,
            WorkplaceMonitor: this.chemicalHistoryDetails.WorkplaceMonitor,
          });
        }
      });
  }

  onSelectChange(radioBtn: string, ipField: string, dateField?: string) {
    // console.log(radioBtn);
    // console.log(ipField);

    if(!this.formControls[radioBtn].value) {
      this.formControls[ipField].reset();
      if(dateField) {
        this.formControls[dateField].reset();
        this.formControls[dateField].clearValidators();
      }
      this.formControls[ipField].clearValidators();
    } else {
      this.formControls[ipField].setValidators(Validators.required);
      if(dateField) {
        this.formControls[dateField].setValidators(Validators.required);
      }
    }
    this.formControls[ipField].updateValueAndValidity();
    if(dateField) {
      this.formControls[dateField].updateValueAndValidity();
    }
  }
  onSelectChangeChemicalExpose(radioBtn: string, ipField: string, ipField2: string, ipField3: string) {
    // console.log(radioBtn);
    // console.log(ipField);
    // console.log(ipField2);
    // console.log(ipField3);

    if(!this.formControls[radioBtn].value) {
      this.formControls[ipField].reset();
      this.formControls[ipField2].reset();
      this.formControls[ipField3].reset();
      this.formControls[ipField].clearValidators();
      this.formControls[ipField2].clearValidators();
      this.formControls[ipField3].clearValidators();
    }
    else {
      this.formControls[ipField].setValidators(Validators.required);
      this.formControls[ipField2].setValidators(Validators.required);
      this.formControls[ipField3].setValidators(Validators.required);
    }
    this.formControls[ipField].updateValueAndValidity();
    this.formControls[ipField2].updateValueAndValidity();
    this.formControls[ipField3].updateValueAndValidity();
  }
  clearInput(ipField: string){
    // console.log(ipField);
    if(ipField) {
    this.formControls[ipField].reset();
    this.formControls[ipField].setValidators(Validators.required);
    } else {
      this.formControls[ipField].clearValidators();
    }
    this.formControls[ipField].updateValueAndValidity();
  }
  
  onSubmit() {
    this.chemicalHistoryForm.markAllAsTouched();
    // console.log(this.chemicalHistoryForm);
    this.chemicalHistoryForm.value.SymptomsDate = moment(this.chemicalHistoryForm.value.SymptomsDate).format('DD/MM/YYYY');

    if (this.chemicalHistoryForm.valid) {
      const chemicalHistoryDataPayLoad = {
        msChemicalHistory: {
          ...this.chemicalHistoryForm.value
        }
      }
      // console.log(chemicalHistoryDataPayLoad);

      this.medicalSurveillanceService.addEditChemicalHistory(chemicalHistoryDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          // console.log(response);
          if (response['status'] == 200) {
            if (this.chemicalHistoryForm.value.Id > 0) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getChemicalHistoryDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getChemicalHistoryDetails();
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
