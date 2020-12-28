import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AuthenticationService, OhdService } from '../../../../core/services';

@Component({
  selector: 'ohs-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss']
})
export class UpdateuserComponent implements OnInit, OnDestroy {
  @ViewChild('updateUser', { static: true }) public updateUser!: TemplateRef<any>;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  @Output() updateUserDataEvent: EventEmitter<any> = new EventEmitter();
  private onDestroyUnSubscribe = new Subject<void>();
  public modalRef!: BsModalRef;

  public manageUser!: FormGroup;
  public userRoleData: any;
  public dataDetails: any;
  public allUserList: any;
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 10;
  public noDataText: string = `Please wait while we're fetching your data...`;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private ohdService: OhdService
  ) { }

  ngOnInit(): void {
    this.manageUser = this.fb.group({
      Id: [''],
      userRole: ['', Validators.required],
      userName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z ]")]],
      userId: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      userPassword: ['', [Validators.required, Validators.pattern(/^\S*$/), Validators.minLength(6)]]
    });

    this.getAllUserRoles();
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

  getAllUserRoles() {
    this.ohdService.getAllUserRoles()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allUserRoles: any) => {
        this.userRoleData = allUserRoles['userRoles'];
        // console.log(this.userRoleData);
      });
  }

  onSubmit() {
    this.manageUser.markAllAsTouched();
    const manageUserDataPayLoad = {
      Id: this.manageUser.value.Id,
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
            if (Object.keys(response).length) {
              this.updateUserDataEvent.emit(manageUserDataPayLoad);
              this.modalRef.hide();
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });
            }
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    }
  }

  // Open Bsmodal
  openModal(data: any) {
    this.modalRef = this.modalService.show(this.updateUser, { class: 'updateUser-modal modal-dialog-centered' });
    this.dataDetails = data;
    // console.log(this.dataDetails);

    this.manageUser.patchValue({
      Id: this.dataDetails.Id,
      userId: this.dataDetails.LoginId,
      userRole: +(this.dataDetails.UserRoleId),
      userName: this.dataDetails.UserName,
      userPassword: this.dataDetails.Passwd
    });
  }

  resetCancel() {
    this.manageUser.reset();
    // this.formDirective.reset();
    this.manageUser.patchValue({
      userRole: ''
    });
  }
}
