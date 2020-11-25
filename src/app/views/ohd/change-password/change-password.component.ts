import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl, FormGroupDirective, AsyncValidatorFn } from '@angular/forms';
import { FormControlValidator, PasswordValidator } from '../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services';

@Component({
  selector: 'ohs-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public changePasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      UserId: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      OldPassword: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)]],
      NewPassword: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)]],
      ConfirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)]]
    }, { validator: PasswordValidator('NewPassword', 'ConfirmPassword') });
  }

  get formControls() {
    return this.changePasswordForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  onSubmit() {
    this.changePasswordForm.markAllAsTouched();
    this.formControls.UserId.setValue(this.authenticationService.getUserID());
    const changePasswordDataPayLoad = {
      userID: this.changePasswordForm.value.UserId,
      oldPassword: this.changePasswordForm.value.OldPassword,
      password: this.changePasswordForm.value.NewPassword,
    }
    // console.log(changePasswordDataPayLoad);
    
    if (this.changePasswordForm.valid) {
      this.authenticationService.changeUserPassword(changePasswordDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            this.snackBar.open('Password Changed Successfully', 'Close', {
              panelClass: 'success-popup',
            });
            this.formDirective.resetForm();
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    }
  }
  resetCancel() {
    this.formDirective.resetForm();
    this.changePasswordForm.patchValue({
      UserId: ''
    })
  }

}
