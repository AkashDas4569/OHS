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
  selector: 'ohs-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public checkoutForm!: FormGroup;

  public employeeId: number = 0;
  public doctorId: number = 0;
  public userId: number = 0;
  public employeeTestVisitId: number = 0;
  public checkoutDetails: any;
  public employeeDetailsForchkout: any = {};
  public saveNext: boolean = false;
  public updateNext: boolean = true;
  public btnAction: any;

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
    this.btnAction = document.getElementById('checkOutBtn');

    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];
      this.doctorId = +params['dId'];

      // console.log('employeeId: ', this.employeeId);
      // console.log('employeeTestVisitId: ', this.employeeTestVisitId);
      // console.log('doctorId: ', this.doctorId);
    });
    this.userId = Number(this.authenticationService.getUserLoggedInID());
    // console.log(this.userId);

    this.checkoutForm = this.fb.group({
      // Id: [0],
      EmployeeId: ['', Validators.required],
      EmployeeOHSTestVisitId: ['', Validators.required],
      CheckOutUserId: ['', Validators.required],
      MedSurStatusListId: [11, Validators.required],
      Checkout: [true],
      Fit: [{value: '', disabled: true}, Validators.required],
    });

    this.formControls.EmployeeId.setValue(this.employeeId);
    this.formControls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.formControls.CheckOutUserId.setValue(this.userId);

    this.getEmployeeById();
    this.getCheckoutDetails();
  }

  get formControls() {
    return this.checkoutForm.controls;
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
        this.employeeDetailsForchkout = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForchkout);
      });
  }
  getCheckoutDetails() {
    const checkoutHistory = {
      employeeID: this.checkoutForm.value.EmployeeId,
      employeeOHSTestVisitId: this.checkoutForm.value.EmployeeOHSTestVisitId
    }
    // console.log(checkoutHistory);

    this.medicalSurveillanceService.getCheckoutDetails(checkoutHistory)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((checkoutData: any) => {
      if (checkoutData['status'] == 200) {
        this.checkoutDetails = checkoutData['medSurCheckOut'];
          // console.log(this.checkoutDetails);

          this.checkedTrue();
      }
    });
  }
  checkedTrue() {
    if(((this.checkoutDetails.MedicalCondition === true) && (this.checkoutDetails.PastMedicalHistory === true) && (this.checkoutDetails.FamilyHistory === true) && (this.checkoutDetails.OccupationalHistory === true) && (this.checkoutDetails.PresentChemicalHistory === true) && (this.checkoutDetails.PhysicalExam === true) && (this.checkoutDetails.LabInvestigation === true) && (this.checkoutDetails.ExamOutcomeAndRecord === true) && (this.checkoutDetails.EmployeeMedicalRecordBook === true))) {
      this.checkoutForm.get('Fit')?.enable();
      this.btnAction.disabled = false;
    } else {
      this.checkoutForm.get('Fit')?.disable();
      this.btnAction.disabled = true;
    }
  }

  onSubmit() {
    this.checkoutForm.markAllAsTouched();
    // console.log(this.checkoutForm);

    if (this.checkoutForm.valid) {
      const checkoutDataPayLoad = {
        medSurCheckOut: {
          ...this.checkoutForm.value
        }
      }
      // console.log(checkoutDataPayLoad);

      this.medicalSurveillanceService.addEditCheckout(checkoutDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        // console.log(response);
        if(response['status'] == 200) {
          this.snackBar.open('Employee CheckOut Successfully', 'Close', {
            panelClass: 'success-popup',
          });

          // this.getCheckoutDetails();
          this.router.navigate(['/medical-surveillance', 'list']);
        } else {
          this.snackBar.open('Something went wrong! Please try again.', 'Close', {
            panelClass: 'error-popup',
          });
        }
      });
    }
  }
}
