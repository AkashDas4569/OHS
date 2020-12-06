import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { AuthenticationService } from '../../../core/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
// RxJs
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ohs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();
  public loginForm!: FormGroup;
  loginData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userID: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  
  onSubmitLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      if(this.loginForm.valid) {
        this.authenticationService.login(this.loginForm.value)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((loggedIn: any) => {
          console.log(loggedIn);
          if (loggedIn['status'] == 200) {
            console.log('After Login');
            this.loginData = loggedIn;
            // console.log(this.loginData);
            localStorage.setItem('authKey', loggedIn['user']['authKey']);
            localStorage.setItem('Active', loggedIn['user']['Active']);
            localStorage.setItem('Id', loggedIn['user']['Id']);
            localStorage.setItem('UserRoleId', loggedIn['user']['UserRoleId']);
            localStorage.setItem('UserID', loggedIn['user']['LoginId']);
            localStorage.setItem('UserName', loggedIn['user']['UserName']);
            this.router.navigate(['/user', 'dashboard']);
          }  else {
            // this.snackBar.open(loggedIn['Errors']['Invalid'], 'Close', {
              this.snackBar.open('User does not exist!', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
      }
    }
  }


}
