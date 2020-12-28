import { Component, OnChanges, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { LookupService, OhsClientService } from '../../../core/services';

@Component({
  selector: 'ohs-ohs-client-settings',
  templateUrl: './ohs-client-settings.component.html',
  styleUrls: ['./ohs-client-settings.component.scss']
})
export class OhsClientSettingsComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public ohsClientSettingsForm!: FormGroup;

  public addEditOhsClientDataPayLoad: any = {};
  public allStateList: any[] = [];
  public allCityList: any[] = [];
  public allIndustryList: any;
  public allChemicalList: any = [];
  public clientId: number = 0;
  public clientDetails: any;
  public isChecked!: boolean;
  public nationality: string = 'MY';
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
    private lookupService: LookupService,
    private ohsClientService: OhsClientService
  ) { }

  ngOnChanges(): void { }

  ngOnInit(): void {
    this.ohsClientSettingsForm = this.fb.group({
      Id: [''],
      Active: [true],
      CompanyName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]")]],
      IndSectorListId: ['', Validators.required],
      Addr1: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z0-9 ]"), Validators.maxLength(150)]],
      City: ['', Validators.required],
      State: ['', Validators.required],
      PostCode: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]],
      ContactPerson: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-Z ]")]],
      CPDesignation: ['', Validators.pattern(".*\\S.*[a-zA-Z ]")],
      CPMobileTel: ['',
        [
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(10),
          Validators.maxLength(14)
        ]],
      CPOfficeTel: ['',
        [
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(9),
          Validators.maxLength(13)
        ]
      ],
      CPEmail: ['', Validators.email],
      ClientChemicalUse: this.fb.array([])
    });

    this.getIndustryList();
    this.getChemicalList();

    // Lookup Service Data
    this.nationalityChange();
    this.stateChange();

    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
      if(isNaN(this.clientId)) {
        this.clientId = 0;
      }
      // console.log(this.clientId);

      this.getClientDetails();
    });
  }

  get formControls() {
    return this.ohsClientSettingsForm.controls;
  }
  get chemicalListArray() {
    return this.formControls.ClientChemicalUse as FormArray;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getIndustryList() {
    this.lookupService.getIndustryList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allIndustryList: any) => {
        this.allIndustryList = allIndustryList['chemicalList'];
      });
  }
  getChemicalList() {
    this.noDataText = `Please wait while we're fetching your data...`;

    this.lookupService.getChemicalList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allChemicalList: any) => {
        this.allChemicalList = allChemicalList['chemicalList'];
        this.allChemicalList.map((item: any) => {
          // console.log(item);
          this.addEditChemicalFormGroup(item);
        })
        // console.log(this.allChemicalList);
        this.noDataText = 'No Data Found';
        this.getClientDetails();
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
          if ((this.clientId && !isNaN(this.clientId)) && this.ohsClientSettingsForm.value.Id > 0) {
            this.formControls.State.setValue(this.clientDetails.State);
            this.formControls.City.setValue(this.clientDetails.City);
          }
        }
      });
  }
  stateChange() {
    this.formControls.State.valueChanges
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((value: any) => {
        if (value) {
          const data = {
            Id: value
          }
          this.getCity(data);
        }
      });
  }
  getCity(value: any) {
    this.formControls.City.reset();
    if (value) {

      this.loadCityList(value);
    }
  }
  loadCityList(data: string) {
    this.lookupService.getCityList(data)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((cityData: any) => {
          if (cityData['cityList'].length) {
            this.allCityList = cityData['cityList'];
            if ((this.clientId && !isNaN(this.clientId)) && this.ohsClientSettingsForm.value.Id > 0) {
              this.formControls.City.setValue(this.clientDetails.City);
            }
          }
        });
  }

  private chemicalData(data: any): any{
    return this.fb.group({
          Id: [this.clientId, Validators.required],
          ClientId: [this.clientId, Validators.required],
          ChemicalListId: [data.Id, Validators.required],
          // ChemName: [data.ChemName],
          Active: [false]
        });
  }
  addEditChemicalFormGroup(data: any): void{
    this.chemicalListArray.push(this.chemicalData(data));
  }
  
  getClientDetails() {
    if (this.clientId && !isNaN(this.clientId)) { 
      this.ohsClientService.getClientById({ clientID: this.clientId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if(response['status'] == 200) {
            this.clientDetails = response['client'];
            // console.log(this.clientDetails);

            this.ohsClientSettingsForm.patchValue({
              Id: this.clientDetails.Id,
              CompanyName: this.clientDetails.CompanyName,
              IndSectorListId: +(this.clientDetails.IndSectorListId),
              Addr1: this.clientDetails.Addr1,
              City: this.clientDetails.City,
              State: this.clientDetails.State,
              PostCode: this.clientDetails.PostCode,
              ContactPerson: this.clientDetails.ContactPerson,
              CPDesignation: this.clientDetails.CPDesignation,
              CPMobileTel: this.clientDetails.CPMobileTel,
              CPOfficeTel: this.clientDetails.CPOfficeTel,
              CPEmail: this.clientDetails.CPEmail,
              ClientChemicalUse: this.clientDetails.ClientChemicalUse
            });

            // this.allChemicalList = this.clientDetails.ClientChemicalUse;
            // this.allChemicalList.map((item: any) => {
            //   console.log(item);
            //   this.addEditChemicalFormGroup(item);
            // });
          }
        });
    }
  }

  onSubmit() {
    this.ohsClientSettingsForm.markAllAsTouched();

    if (this.ohsClientSettingsForm.valid) {
      if ((this.clientId && !isNaN(this.clientId)) && this.ohsClientSettingsForm.value.Id > 0) {
      this.addEditOhsClientDataPayLoad = {
        client: {
          Id: this.ohsClientSettingsForm.value.Id,
          Active: this.ohsClientSettingsForm.value.Active,
          CompanyName: this.ohsClientSettingsForm.value.CompanyName,
          IndSectorListId: +(this.ohsClientSettingsForm.value.IndSectorListId),
          Addr1: this.ohsClientSettingsForm.value.Addr1,
          City: this.ohsClientSettingsForm.value.City,
          State: this.ohsClientSettingsForm.value.State,
          PostCode: this.ohsClientSettingsForm.value.PostCode,
          ContactPerson: this.ohsClientSettingsForm.value.ContactPerson,
          CPDesignation: this.ohsClientSettingsForm.value.CPDesignation,
          CPMobileTel: this.ohsClientSettingsForm.value.CPMobileTel,
          CPOfficeTel: this.ohsClientSettingsForm.value.CPOfficeTel,
          CPEmail: this.ohsClientSettingsForm.value.CPEmail,
          ClientChemicalUse: this.ohsClientSettingsForm.value.ClientChemicalUse
        }
      }
    } else {
      this.addEditOhsClientDataPayLoad = {
        client: {
          Id: 0,
          Active: this.ohsClientSettingsForm.value.Active,
          CompanyName: this.ohsClientSettingsForm.value.CompanyName,
          IndSectorListId: +(this.ohsClientSettingsForm.value.IndSectorListId),
          Addr1: this.ohsClientSettingsForm.value.Addr1,
          City: this.ohsClientSettingsForm.value.City,
          State: this.ohsClientSettingsForm.value.State,
          PostCode: this.ohsClientSettingsForm.value.PostCode,
          ContactPerson: this.ohsClientSettingsForm.value.ContactPerson,
          CPDesignation: this.ohsClientSettingsForm.value.CPDesignation,
          CPMobileTel: this.ohsClientSettingsForm.value.CPMobileTel,
          CPOfficeTel: this.ohsClientSettingsForm.value.CPOfficeTel,
          CPEmail: this.ohsClientSettingsForm.value.CPEmail,
          ClientChemicalUse: this.ohsClientSettingsForm.value.ClientChemicalUse
        }
      }
    }

      // console.log('Valid', this.ohsClientSettingsForm);
      // console.log(this.addEditOhsClientDataPayLoad);

      this.ohsClientService.addEditOhsClientModule(this.addEditOhsClientDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            if ((this.clientId && !isNaN(this.clientId))) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });
            } 
            else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });
            }
            this.ohsClientSettingsForm.patchValue({
              Id: ''
            })
            this.formDirective.resetForm();
            this.router.navigate(['/ohs-client/list']);
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    } else {
      // console.log('In-Valid', this.ohsClientSettingsForm);
      // console.log(this.addEditOhsClientDataPayLoad);
      this.snackBar.open('Error!! Required fields need to be filled before Submit.', 'Close', {
        panelClass: 'error-popup',
      });
    }
  }

}
