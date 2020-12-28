import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl, FormGroupDirective, AsyncValidatorFn } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AuthenticationService, OhdService } from '../../../core/services';

@Component({
  selector: 'ohs-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public manageUser!: FormGroup;

  public userRoleData: any;
  public allUserList: any;
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 10;
  public noDataText: string = `Please wait while we're fetching your data...`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private ohdService: OhdService
  ) { }

  ngOnInit(): void {
    this.manageUser = this.fb.group({
      userRole: ['', Validators.required],
      userName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z ]")]],
      userId: ['', [Validators.required, Validators.pattern(/^\S*$/)], this.userIdDuplicateValidator()],
      userPassword: ['', [Validators.required, Validators.pattern(/^(?!.*[\s])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)]]
    });

    this.getAllUserRoles();
    this.getUserList();
  }

  get formControls() {
    return this.manageUser.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  userIdDuplicateValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const UserIdData = {
        userID: control.value,
        loader: '0'
      };

      if (control.errors && !control.errors.userIdTaken) {
        // return if another validator has already found an error on the matchingControl
        return of(null);
      }
      if ((this.allUserList.LoginId === this.formControls.userId.value)) {
        return of(null);
      } else {
        return this.authenticationService.checkIsValidUserId(UserIdData)
          .pipe(
            map((res: any) => {
              if (res.valid) {
                return null;
              } else {
                return { userIdTaken: true };
              }
            }
            ),
            catchError(() => {
              return of({ UserIdCheckFailed: true });
            })
          );
      }
    };
  }

  getAllUserRoles() {
    this.ohdService.getAllUserRoles()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allUserRoles: any) => {
        this.userRoleData = allUserRoles['userRoles'];
        // console.log(this.userRoleData);
      });
  }
  getUserList() {
    this.noDataText = `Please wait while we're fetching your data...`;

    this.ohdService.getUserList({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allUserList: any) => {
        // console.log(allUserList);
        this.allUserList = allUserList['users'];
        // console.log(this.allUserList);
        this.noDataText = 'No Data Found';
      });
  }

  onSubmit() {
    this.manageUser.markAllAsTouched();
    const manageUserDataPayLoad = {
      Id: 0,
      loginID: this.manageUser.value.userId,
      userRoleID: +(this.manageUser.value.userRole),
      userName: this.manageUser.value.userName,
      passwd: this.manageUser.value.userPassword,
      active: Boolean(this.authenticationService.getStatus())
    }
    // console.log(manageUserDataPayLoad);

    if (this.manageUser.valid) {
      this.ohdService.addEditUserModule(manageUserDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            this.snackBar.open('Saved Successfully', 'Close', {
              panelClass: 'success-popup',
            });
            this.getUserList();
            this.formDirective.resetForm();
            this.manageUser.patchValue({
              userRole: ''
            });
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    }
  }

  resetCancel() {
    // this.manageUser.reset();
    this.formDirective.resetForm();
    this.manageUser.patchValue({
      userRole: ''
    })
  }

  openModal(template: any, data: any) {
    template.openModal(data);
  }
  getUpdatedUserDetails(event: any) {
    this.allUserList = event;
    // console.log(this.allUserList);

    this.getUserList();
  }
  getDeletedUserDetails(event: any) {
    this.getUserList();
  }
}
