import { Component, OnInit, TemplateRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FormControlValidator } from '../../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, LookupService, MedicalSurveillanceService } from '../../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ohs-reg-visitpurpose',
  templateUrl: './reg-visitpurpose.component.html',
  styleUrls: ['./reg-visitpurpose.component.scss']
})
export class RegVisitpurposeComponent implements OnInit {
  @ViewChild('registerVisitPurpose', { static: true }) public registerVisitPurpose!: TemplateRef<any>;
  private onDestroyUnSubscribe = new Subject<void>();
  modalRef!: BsModalRef;
  public visitPurpose!: FormGroup;
  public allVisitPurposeData: any;
  public allOHDDoctorList: any;
  public regFormData: any;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private medicalSurveillanceService: MedicalSurveillanceService
  ) { }

  ngOnInit(): void {
    this.visitPurpose = this.fb.group({
        EmployeeId: ['', Validators.required],
        ClientId: ['', Validators.required],
        MedSurStatusListId: [1, Validators.required],
        CheckInTS: [''],
        CheckInUserId: ['', Validators.required],
        OHDClinicId: ['', Validators.required],
        TestTypeListId: ['', Validators.required],
        OHDDoctorId: ['', Validators.required]
    });

    this.getVisitPurposeList();
    this.getOHDDoctorList();
  }

  get formControls() {
    return this.visitPurpose.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }

  getVisitPurposeList() {
    this.lookupService.getVisitPurposeList()
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((result: any) => {
      this.allVisitPurposeData = result['TestTypeList'];
      // console.log(this.allVisitPurposeData);
    });
  }
  getOHDDoctorList() {
      this.lookupService.getOHDDoctorList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        this.allOHDDoctorList = result['OHDoctorList'];
        // console.log(this.allOHDDoctorList);
    });
  }

  onSubmit() {
    this.visitPurpose.markAllAsTouched();
    this.formControls.CheckInUserId.setValue(Number(this.authenticationService.getUserLoggedInID()));
    this.formControls.OHDClinicId.setValue(Number(this.authenticationService.getClinicId()));
    // console.log(this.visitPurpose);
    
    if (this.visitPurpose.valid) {
      const visitPurposeDataPayLoad = {
        medSur: {
        EmployeeId: this.visitPurpose.value.EmployeeId,
        ClientId: this.visitPurpose.value.ClientId,
        MedSurStatusListId: this.visitPurpose.value.MedSurStatusListId,
        CheckInTS: this.visitPurpose.value.CheckInTS,
        CheckInUserId: this.visitPurpose.value.CheckInUserId,
        OHDClinicId: this.visitPurpose.value.OHDClinicId,
        TestTypeListId: this.visitPurpose.value.TestTypeListId,
        OHDDoctorId: +(this.visitPurpose.value.OHDDoctorId)
        }
      }

      console.log(visitPurposeDataPayLoad);

      this.medicalSurveillanceService.addMedicalSurveillance(visitPurposeDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((checkIn: any) => {
        if (checkIn['status'] == 200) {
          this.modalRef.hide();
          this.router.navigate(['/medical-surveillance/list']);
        } 
        else if (checkIn['status'] == 406) {
         // this.modalRef.hide();
          this.snackBar.open('Employee already CheckedIn', 'Close', {
            panelClass: 'error-popup',
          });
        }
      });
    }
  }

  // Open Bsmodal
  openModal(regFormData: any) {
    this.modalRef = this.modalService.show(this.registerVisitPurpose, { class: 'registerVisitPurpose-modal modal-lg modal-dialog-centered' });
    this.regFormData = regFormData;
    // console.log(this.regFormData);

    this.visitPurpose.patchValue({
        EmployeeId: this.regFormData.Id,
        ClientId: this.regFormData.clientId,
    });
  }
  closeModal() {
    this.modalRef.hide();
    this.visitPurpose.reset();
    this.router.navigate(['/employee/registration']);
  }
}
