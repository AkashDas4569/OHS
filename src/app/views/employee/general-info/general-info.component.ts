import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { MaritalStatus, Gender, Relationship } from '../../../core/utilities';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, EmployeeService } from '../../../core/services';
// RxJs
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'ohs-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public employeeRegistrationForm!: FormGroup;

  public date = new Date().toISOString();
  public maxDate = moment();
  public noDataText: string = `Please wait while we're fetching your data...`;
  public maritalStatusList = MaritalStatus;
  public sexData = Gender;
  public relationshipData = Relationship;
  public nationality: string = 'MY';
  public employeeId: number = 0;
  public employeeDetails: any;
  public countryList: any[] = [];
  public ethnicList: any[] = [];
  public allStateList: any[] = [];
  public allClientList: any[] = [];
  public addEditEmployeeDataPayLoad: any = {};

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    // console.log('Router Name: ', this.router.url.split('/')[2]);
    this.employeeRegistrationForm = this.fb.group({
      clientId: ['', Validators.required],
      Id: [''],
      egcId: [''],
      EmpName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      DOB: ['', Validators.required],
      Age: ['', Validators.required],
      Address: ['', [Validators.pattern(".*\\S.*[a-zA-Z0-9 ]"), Validators.maxLength(150)]],
      District: ['', Validators.pattern(".*\\S.*[a-zA-Z ]")],
      State: ['', Validators.required],
      contactNo: ['',[
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(14)
      ]],
      Postcode: ['', [Validators.pattern(".*\\S.*[0-9]"), Validators.minLength(6)]],
      ICNum: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]"), Validators.maxLength(12)], this.employeeMykadIcDuplicateValidator()],
      MartialStatus: [''],
      SOCSONum: ['', [Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      WorkerCompNo: ['', [Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      WorkPermitNo: ['', [Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      Gender: ['', Validators.required],
      NoYrsMarried: ['', [Validators.pattern(".*\\S.*[0-9]"), Validators.maxLength(3)]],
      NoOfChild: ['', [Validators.pattern(".*\\S.*[0-9]"), Validators.maxLength(3)]],
      Ethnic: [''],
      Nationality: ['MY', Validators.required],
      EmergencyContactName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z ]")]],
      EmergencyContactRelationship: ['', Validators.required],
      EmergencyContactTel: ['', [
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(9),
        Validators.maxLength(13)
      ]],
      EmergencyContactAddress: ['', Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")],
      EmergencyContactPostcode: ['', [Validators.pattern(".*\\S.*[0-9 ]"), Validators.minLength(6)]],
      EmployeerName: ['', [Validators.pattern(".*\\S.*[a-zA-Z ]")]],
      EmergencyContactPhone: ['', [
        Validators.pattern(/^[0-9]*$/),
        Validators.minLength(10),
        Validators.maxLength(14)
      ]],
      EmergencyContactFax: ['', [Validators.pattern(".*\\S.*[0-9]"), Validators.minLength(8), Validators.maxLength(12)]],
      EmergencyContactEmail: ['', [Validators.email]],
      // visitPurpose: ['', Validators.required],
    });

    this.dobChange();

    // Lookup Service Data
    this.nationalityChange();
    this.getCompanyList();
    this.getCountryList();
    this.getEthnicList();

    this.route.params.subscribe(params => {
      this.employeeId = +params['id'];
      if(isNaN(this.employeeId)) {
        this.employeeId = 0;
      }
      console.log(this.employeeId);

      this.getEmployeeDetails();
    });
  }

  get formControls() {
    return this.employeeRegistrationForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  dobChange() {
    this.formControls.DOB.valueChanges
    .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((value: any) => {
          // console.log(value);
        
          const ageValue = moment().diff(value, 'years');
          this.formControls.Age.setValue(ageValue);
          this.formControls.Age.updateValueAndValidity();
          console.log(ageValue);
        }
      );
  }
  employeeMykadIcDuplicateValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const myKadData = {
        ICNUmber: control.value,
        loader: '0'
      };

      if (control.errors && !control.errors.icMykadTaken) {
        // return if another validator has already found an error on the matchingControl
        return of(null);
      }
      if (this.router.url.split('/')[2] === 'update-general-info' && (this.employeeDetails.ICNum === this.formControls.ICNum.value)) {
        return of(null);
      } else {
        return this.employeeService.isValidMykadIcNumber(myKadData)
          .pipe(
            map((res: any) => {
              if (res.valid) {
                return null;
              } else {
                return { icMykadTaken: true };
              }
            }
            ),
            catchError(() => {
              return of({ mykadCheckFailed: true });
            })
          );
      }
    };
  }
  getCompanyList() {
    this.lookupService.getClientList()
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((clientList: any) => {
      this.allClientList = clientList['ClientList'];
      // console.log(this.allClientList);
    });
  }
  getCountryList() {
    this.lookupService.getCountryList({})
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((countryList: any) => {
      this.countryList = countryList['CountryList'];
      // console.log(this.countryList);
    });
  }
  getEthnicList() {
    this.lookupService.getEthnicList({})
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((ethnicList: any) => {
      this.ethnicList = ethnicList['CountryList'];
      // console.log(this.ethnicList);
    });
  }
  nationalityChange() {
    if (this.nationality) {
      const data = {
        cntId: this.nationality
      }
      this.getState(data);
    }
  }
  getState(value: any) {
    if (value) {

      this.loadStateList(value);
    }
  }
  loadStateList(data: string) {
    this.lookupService.getStateList(data)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((state: any) => {
        if (state['stateList'].length) {
          this.allStateList = state['stateList'];
          if ((this.employeeId && !isNaN(this.employeeId)) && this.employeeRegistrationForm.value.Id > 0) {
            this.formControls.State.setValue(this.employeeDetails.State);
            // this.formControls.City.setValue(this.clientDetails.City);
          }
        }
      });
  }

  getEmployeeDetails() {
    if (this.employeeId && !isNaN(this.employeeId)) { 
      this.employeeService.getEmployeeDetailsById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if(response['status'] == 200) {
          this.employeeDetails = response['employeeDetails'];
          console.log(this.employeeDetails);

          this.employeeRegistrationForm.patchValue({
            Id: this.employeeDetails.Id,
            clientId: this.employeeDetails.ClientId,
            egcId: this.employeeDetails.egcId,
            EmergencyContactName: this.employeeDetails.egcName,
            EmergencyContactRelationship: this.employeeDetails.egcRelationship,
            EmergencyContactTel: this.employeeDetails.egcTelNo,
            EmergencyContactAddress: this.employeeDetails.egcAddress,
            EmployeerName: this.employeeDetails.egcNameOfEmployer,
            EmergencyContactEmail: this.employeeDetails.egcEmail,
            // egcEmployerAddr: null,
            EmergencyContactPostcode: this.employeeDetails.egcPostcode,
            EmergencyContactPhone: this.employeeDetails.egcContactNumber,
            EmergencyContactFax: this.employeeDetails.egcFax,
  
            EmpName: this.employeeDetails.EmpName,
            Address: this.employeeDetails.Addr1,
            // Addr2: null,
            District:  this.employeeDetails.District,
            State:  this.employeeDetails.State,
            Postcode:  this.employeeDetails.Postcode,
            contactNo:  this.employeeDetails.PhoneNumber,
            ICNum:  this.employeeDetails.ICNum.replace(/[\+\- )(]/g,''),
            DOB: moment(this.employeeDetails.DateOfBirth, 'DD/MM/YYYY'),
            Age:  this.employeeDetails.Age,
            SOCSONum:  this.employeeDetails.SOCSONum,
            WorkPermitNo: this.employeeDetails.WorkPermitNo,
            WorkerCompNo: this.employeeDetails.WorkCompensationNo,
            Gender:  this.employeeDetails.Gender,
            MartialStatus:  this.employeeDetails.MartialStatus,
            NoOfChild:  this.employeeDetails.NoOfChild,
            NoYrsMarried:  this.employeeDetails.NoYrsMarried,
            Ethnic:  +(this.employeeDetails.Ethnic),
            Nationality:  this.employeeDetails.Nationality,
          });
        }
      });
    }
  }

  onSubmit(registerVisitPurpose: any) {
    this.employeeRegistrationForm.markAllAsTouched();
    console.log(this.employeeRegistrationForm);
    const userId = Number(this.authenticationService.getUserLoggedInID());
    this.employeeRegistrationForm.value.DOB = moment(this.employeeRegistrationForm.value.DOB).format('DD/MM/YYYY');
    this.employeeRegistrationForm.value.ICNum = this.employeeRegistrationForm.value.ICNum.replace(/[\+\- )(]/g, '');

    // this.openCheckInModal(registerVisitPurpose);

    if(this.employeeRegistrationForm.valid) {
      if ((this.employeeId && !isNaN(this.employeeId)) && this.employeeRegistrationForm.value.Id > 0) {
        this.addEditEmployeeDataPayLoad = {
          employee: {
            Id: this.employeeRegistrationForm.value.Id,
            ClientId: this.employeeRegistrationForm.value.clientId,
            egcId: this.employeeRegistrationForm.value.egcId,
            egcName: this.employeeRegistrationForm.value.EmergencyContactName,
            egcRelationship: this.employeeRegistrationForm.value.EmergencyContactRelationship,
            egcTelNo: this.employeeRegistrationForm.value.EmergencyContactTel,
            egcAddress: this.employeeRegistrationForm.value.EmergencyContactAddress,
            egcNameOfEmployer: this.employeeRegistrationForm.value.EmployeerName,
            egcEmail: this.employeeRegistrationForm.value.EmergencyContactEmail,
            egcEmployerAddr: null,
            egcPostcode: this.employeeRegistrationForm.value.EmergencyContactPostcode,
            egcContactNumber: this.employeeRegistrationForm.value.EmergencyContactPhone,
            egcFax: this.employeeRegistrationForm.value.EmergencyContactFax,
  
            EmpName: this.employeeRegistrationForm.value.EmpName,
            Addr1: this.employeeRegistrationForm.value.Address,
            // Addr2: null,
            District:  this.employeeRegistrationForm.value.District,
            State:  this.employeeRegistrationForm.value.State,
            Postcode:  this.employeeRegistrationForm.value.Postcode,
            PhoneNumber:  this.employeeRegistrationForm.value.contactNo,
            ICNum:  this.employeeRegistrationForm.value.ICNum,
            DOB:  this.employeeRegistrationForm.value.DOB,
            Age:  this.employeeRegistrationForm.value.Age,
            SOCSONum:  this.employeeRegistrationForm.value.SOCSONum,
            WorkPermitNo: this.employeeRegistrationForm.value.WorkPermitNo,
            WorkCompensationNo: this.employeeRegistrationForm.value.WorkerCompNo,
            Gender:  this.employeeRegistrationForm.value.Gender,
            MartialStatus:  this.employeeRegistrationForm.value.MartialStatus,
            NoOfChild:  this.employeeRegistrationForm.value.NoOfChild,
            NoYrsMarried:  this.employeeRegistrationForm.value.NoYrsMarried,
            Ethnic:  this.employeeRegistrationForm.value.Ethnic,
            Nationality:  this.employeeRegistrationForm.value.Nationality,
            DateRegistered:  null,
            RegUserId:  userId,
            DateUpdated:  null,
            UpdatedUserId:  userId
          }
        }
      } else {
        this.addEditEmployeeDataPayLoad = {
          employee: {
            Id: 0,
            ClientId: this.employeeRegistrationForm.value.clientId,
            egcId: 0,
            egcName: this.employeeRegistrationForm.value.EmergencyContactName,
            egcRelationship: this.employeeRegistrationForm.value.EmergencyContactRelationship,
            egcTelNo: this.employeeRegistrationForm.value.EmergencyContactTel,
            egcAddress: this.employeeRegistrationForm.value.EmergencyContactAddress,
            egcNameOfEmployer: this.employeeRegistrationForm.value.EmployeerName,
            egcEmail: this.employeeRegistrationForm.value.EmergencyContactEmail,
            egcEmployerAddr: null,
            egcPostcode: this.employeeRegistrationForm.value.EmergencyContactPostcode,
            egcContactNumber: this.employeeRegistrationForm.value.EmergencyContactPhone,
            egcFax: this.employeeRegistrationForm.value.EmergencyContactFax,
  
            EmpName: this.employeeRegistrationForm.value.EmpName,
            Addr1: this.employeeRegistrationForm.value.Address,
            // Addr2: null,
            District:  this.employeeRegistrationForm.value.District,
            State:  this.employeeRegistrationForm.value.State,
            Postcode:  this.employeeRegistrationForm.value.Postcode,
            PhoneNumber:  this.employeeRegistrationForm.value.contactNo,
            ICNum:  this.employeeRegistrationForm.value.ICNum,
            DOB:  this.employeeRegistrationForm.value.DOB,
            Age:  this.employeeRegistrationForm.value.Age,
            SOCSONum:  this.employeeRegistrationForm.value.SOCSONum,
            WorkPermitNo: this.employeeRegistrationForm.value.WorkPermitNo,
            WorkCompensationNo: this.employeeRegistrationForm.value.WorkerCompNo,
            Gender:  this.employeeRegistrationForm.value.Gender,
            MartialStatus:  this.employeeRegistrationForm.value.MartialStatus,
            NoOfChild:  this.employeeRegistrationForm.value.NoOfChild,
            NoYrsMarried:  this.employeeRegistrationForm.value.NoYrsMarried,
            Ethnic:  this.employeeRegistrationForm.value.Ethnic,
            Nationality:  this.employeeRegistrationForm.value.Nationality,
            DateRegistered:  null,
            RegUserId:  userId,
            DateUpdated:  null,
            UpdatedUserId:  userId
          }
        }
      }
      

      console.log(this.addEditEmployeeDataPayLoad);

      this.employeeService.addEditEmployee(this.addEditEmployeeDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((registerIn: any) => {
          if(registerIn['status'] == 200 && registerIn['employeeID']) {
            this.formControls.Id.setValue(registerIn['employeeID']);
            this.openCheckInModal(registerVisitPurpose, this.employeeRegistrationForm.value);
          }else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
      });
    }else {
      this.snackBar.open('Something went wrong! Please check all the fields before submitting the form.', 'Close', {
        panelClass: 'error-popup',
      });
    }
   }

   openCheckInModal(template: any, regFormValue: any) {
    template.openModal(regFormValue);
   }
}
