import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
// RxJs
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, OhdService } from '../../../core/services';

@Component({
  selector: 'ohs-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public employeeSearchRegisterForm!: FormGroup;

  public employeeData: any;
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 10;
  public noDataText: string = `Please wait while we're fetching your data...`;
  viewType: number = 1;
  public allOhdClinic: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private ohdService: OhdService,
  ) { }

  ngOnInit(): void {
    this.employeeSearchRegisterForm = this.fb.group({
      employeeName: ['', Validators.pattern(".*\\S.*")],
      icNumber: ['', [Validators.minLength(6), Validators.pattern(".*\\S.*[a-zA-Z0-9]")]],
      phoneNumber: ['', [Validators.pattern(".*\\S.*[0-9]"), Validators.maxLength(14)]],
    });

    this.getOhdClinic();
  }

  get formControls() {
    return this.employeeSearchRegisterForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }
  
  switchView(type: number) {
    this.viewType = type;
  }

  getOhdClinic() {
    this.ohdService.getOhdClinic({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allOhdClinic: any) => {
        this.allOhdClinic = allOhdClinic['ohdClinic'];
        // console.log(this.allOhdClinic);
        localStorage.setItem('OHDClinicId', this.allOhdClinic.Id);
        // console.log(this.allOhdClinic.cName);
      });
  }

  onSubmit() {
    this.employeeSearchRegisterForm.markAllAsTouched();
    if (this.employeeSearchRegisterForm.valid) {
      console.log(this.employeeSearchRegisterForm.value);
    this.noDataText = `Please wait while we're fetching your data...`;
    this.employeeService.getAllEmployeeList(this.employeeSearchRegisterForm.value)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allEmployeeList: any) => {
        console.log(allEmployeeList);
        this.employeeData = allEmployeeList['employees'];
        console.log(this.employeeData);
        this.noDataText = 'No Data Found';
      });
    }
  }
}
