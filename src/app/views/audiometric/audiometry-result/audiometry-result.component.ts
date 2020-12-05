import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AudiometricService, EmployeeService } from '../../../core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import * as _moment from 'moment';
const moment = _moment;
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { Chart } from 'chart.js';
import * as Chart from 'chart.js';

@Component({
  selector: 'ohs-audiometry-result',
  templateUrl: './audiometry-result.component.html',
  styleUrls: ['./audiometry-result.component.scss']
})
export class AudiometryResultComponent implements OnInit, OnDestroy {
  // @ViewChild('yearSalesChart', { static: true }) yearSalesChart!: ElementRef;
  // @ViewChild('yearPatientsChart', { static: true }) yearPatientsChart!: ElementRef;
  @ViewChild('frequencyChartLeftEar', { static: true }) frequencyChartLeftEar!: ElementRef;
  @ViewChild('frequencyChartRightEar', { static: true }) frequencyChartRightEar!: ElementRef;

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  private onDestroyUnSubscribe = new Subject<void>();
  public audiometryResultForm!: FormGroup;

  public minDate = moment().subtract(1, 'month').startOf('month');
  public maxDate = moment();
  public checkInDate: any;
  public employeeId: number = 0;
  // public doctorId: number = 0;
  public userId: number = 0;
  public employeeTestVisitId: number = 0;
  public audiometryResultDetails: any;
  public audiometryResultBaseLineDetails: any;
  public audiometryResultAnnualDetails: any;

  public employeeDetailsForAR: any = {};
  public saveNext: boolean = false;
  public updateNext: boolean = true;
  public canvas: any;
  public ctx: any;
  public noDataText: string = `Please wait while we're fetching your data...`;
  public btnText: string = "Show Graph";
  public showHide: boolean = true;
  public btnAction: any;
  public RightBaseLine: any[] = [];
  public LeftBaseLine: any[] = [];
  public RightAnnual: any[] = [];
  public LeftAnnual: any[] = [];
  public baseLineAvgRight1: number = 0;
  public baseLineAvgRight2: number = 0;
  public baseLineAvgLeft1: number = 0;
  public baseLineAvgLeft2: number = 0;
  public annualAvgRight1: number = 0;
  public annualAvgRight2: number = 0;
  public annualAvgLeft1: number = 0;
  public annualAvgLeft2: number = 0;


  public lineChartOption = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        position: 'bottom',
        scaleLabel: {
          labelString: 'Hz',
          display: true,
        }
      }],
      yAxes: [{
        // stacked: (conditon ? true : false),     // For single graph
        scaleLabel: {
          labelString: 'dB',
          display: true
        }
      }]
    }
  };

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private employeeService: EmployeeService,
    private audiometricService: AudiometricService,
  ) { }

  ngOnInit(): void {
    this.btnAction = document.getElementById('graphBtn');

    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];
      // this.doctorId = +params['dId'];

      console.log('employeeId: ', this.employeeId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
      // console.log('doctorId: ', this.doctorId);
    });
    this.userId = Number(this.authenticationService.getUserLoggedInID());
    console.log(this.userId);

    this.audiometryResultForm = this.fb.group({
      audiometricResult: this.fb.group({
        Id: [0],
        EnteredUserId: ['', Validators.required],
        EmployeeId: ['', Validators.required],
        EmployeeOHSTestVisitId: ['', Validators.required],
        DateOfTest: ['', Validators.required],
        TypeOfAudiogram: ['', Validators.required],
        Audiometer: [''],
        Exposure: [''],
        MaxExposure: [''],
        Results: [''],
        Remarks: [''],
      }),
      audiometricAnnual: this.fb.group({
        AUAnnualId: [0],
        EnteredUserId: ['', Validators.required],
        BaseOrAnnual: ['A'],
        R500: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R1000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R2000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R3000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R4000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R6000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L500: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L1000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L2000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L3000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L4000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L6000: ['', [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgR1: [{ value: '', disabled: true }, [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgL1: [{ value: '', disabled: true }, [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgR2: [{ value: '', disabled: true }, [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgL2: [{ value: '', disabled: true }, [Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]]
      }),
      audiometricBaseline: this.fb.group({
        AUBLBaselineId: [0],
        EnteredUserId: ['', Validators.required],
        BaseOrAnnual: ['B'],
        R500: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R1000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R2000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R3000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R4000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        R6000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L500: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L1000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L2000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L3000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L4000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        L6000: ['', [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgR1: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgL1: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgR2: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]],
        AvgL2: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/), Validators.maxLength(6)]]
      })
    });

    this.calculateBaseLineAvgRight();
    this.calculateBaseLineAvgLeft();
    this.calculateAnnualAvgRight();
    this.calculateAnnualAvgLeft();
    this.audiometricTestGroup.controls.EmployeeId.setValue(this.employeeId);
    this.audiometricTestGroup.controls.EmployeeOHSTestVisitId.setValue(this.employeeTestVisitId);
    this.audiometricTestGroup.controls.EnteredUserId.setValue(this.userId);
    this.baseLineGroup.controls.EnteredUserId.setValue(this.userId);
    this.annualGroup.controls.EnteredUserId.setValue(this.userId);

    this.getEmployeeById();
    // this.getCheckInDateForAudiometric();
    this.getAudiometricResultDetails();

    this.noDataCanvas(this.frequencyChartLeftEar);
    this.noDataCanvas(this.frequencyChartRightEar);
    // this.viewLineChart();
  }

  get formControls() {
    return this.audiometryResultForm.controls;
  }
  get audiometricTestGroup() {
    return this.formControls.audiometricResult as FormGroup;
  }
  get baseLineGroup() {
    return this.formControls.audiometricBaseline as FormGroup;
  }
  get annualGroup() {
    return this.formControls.audiometricAnnual as FormGroup;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  onSelectChange() {
    console.log('Selected Type--> ', this.audiometricTestGroup.controls.TypeOfAudiogram.value);
    if (this.audiometricTestGroup.controls.TypeOfAudiogram.value === 'A') {
      this.annualGroup.controls.R500.setValidators(Validators.required);
      this.annualGroup.controls.R1000.setValidators(Validators.required);
      this.annualGroup.controls.R2000.setValidators(Validators.required);
      this.annualGroup.controls.R3000.setValidators(Validators.required);
      this.annualGroup.controls.R4000.setValidators(Validators.required);
      this.annualGroup.controls.R6000.setValidators(Validators.required);
      this.annualGroup.controls.L500.setValidators(Validators.required);
      this.annualGroup.controls.L1000.setValidators(Validators.required);
      this.annualGroup.controls.L2000.setValidators(Validators.required);
      this.annualGroup.controls.L3000.setValidators(Validators.required);
      this.annualGroup.controls.L4000.setValidators(Validators.required);
      this.annualGroup.controls.L6000.setValidators(Validators.required);
    } else {
      this.annualGroup.controls.R500.clearValidators();
      this.annualGroup.controls.R1000.clearValidators();
      this.annualGroup.controls.R2000.clearValidators();
      this.annualGroup.controls.R3000.clearValidators();
      this.annualGroup.controls.R4000.clearValidators();
      this.annualGroup.controls.R6000.clearValidators();
      this.annualGroup.controls.L500.clearValidators();
      this.annualGroup.controls.L1000.clearValidators();
      this.annualGroup.controls.L2000.clearValidators();
      this.annualGroup.controls.L3000.clearValidators();
      this.annualGroup.controls.L4000.clearValidators();
      this.annualGroup.controls.L6000.clearValidators();
    }
    this.annualGroup.controls.R500.updateValueAndValidity();
    this.annualGroup.controls.R1000.updateValueAndValidity();
    this.annualGroup.controls.R2000.updateValueAndValidity();
    this.annualGroup.controls.R3000.updateValueAndValidity();
    this.annualGroup.controls.R4000.updateValueAndValidity();
    this.annualGroup.controls.R6000.updateValueAndValidity();
    this.annualGroup.controls.L500.updateValueAndValidity();
    this.annualGroup.controls.L1000.updateValueAndValidity();
    this.annualGroup.controls.L2000.updateValueAndValidity();
    this.annualGroup.controls.L3000.updateValueAndValidity();
    this.annualGroup.controls.L4000.updateValueAndValidity();
    this.annualGroup.controls.L6000.updateValueAndValidity();

    this.viewLineChart();
  }
  getEmployeeById() {
    this.employeeService.getEmployeeById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        this.employeeDetailsForAR = result['employeeDataForMedicalConditionModel'];
        // console.log(this.employeeDetailsForAR);
      });
  }
  getAudiometricResultDetails() {
    const audiometricResult = {
      employeeID: this.audiometryResultForm.value.audiometricResult.EmployeeId,
      employeeOHSTestVisitId: this.audiometryResultForm.value.audiometricResult.EmployeeOHSTestVisitId
    }
    // console.log(audiometricResult);

    this.audiometricService.getAudiometricResultDetails(audiometricResult)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((audiometryResultData: any) => {
        console.log(audiometryResultData);
        if (audiometryResultData['status'] == 200) {
          this.audiometryResultDetails = audiometryResultData['audiometricResult'];
          this.audiometryResultBaseLineDetails = audiometryResultData['audiometricBaseline'];
          this.audiometryResultAnnualDetails = audiometryResultData['audiometricAnnual']
          console.log(this.audiometryResultDetails);
          console.log(this.audiometryResultBaseLineDetails);
          console.log(this.audiometryResultAnnualDetails);

          this.audiometryResultForm.patchValue({
            audiometricResult: {
              Id: this.audiometryResultDetails.Id,
              EmployeeId: this.audiometryResultDetails.EmployeeId,
              EmployeeOHSTestVisitId: this.audiometryResultDetails.EmployeeOHSTestVisitId,
              DateOfTest: moment(this.audiometryResultDetails.DOT, 'DD/MM/YYYY'),
              TypeOfAudiogram: this.audiometryResultDetails.TypeOfAudiogram,
              Audiometer: this.audiometryResultDetails.Audiometer,
              Exposure: this.audiometryResultDetails.Exposure,
              MaxExposure: this.audiometryResultDetails.MaxExposure,
              Results: this.audiometryResultDetails.Results,
              Remarks: this.audiometryResultDetails.Remarks,
            },
            audiometricAnnual: {
              AUAnnualId: this.audiometryResultAnnualDetails?.AUAnnualId,
              BaseOrAnnual: this.audiometryResultAnnualDetails?.BaseOrAnnual,
              L500: this.audiometryResultAnnualDetails?.L500,
              L1000: this.audiometryResultAnnualDetails?.L1000,
              L2000: this.audiometryResultAnnualDetails?.L2000,
              L3000: this.audiometryResultAnnualDetails?.L3000,
              L4000: this.audiometryResultAnnualDetails?.L4000,
              L6000: this.audiometryResultAnnualDetails?.L6000,
              R500: this.audiometryResultAnnualDetails?.R500,
              R1000: this.audiometryResultAnnualDetails?.R1000,
              R2000: this.audiometryResultAnnualDetails?.R2000,
              R3000: this.audiometryResultAnnualDetails?.R3000,
              R4000: this.audiometryResultAnnualDetails?.R4000,
              R6000: this.audiometryResultAnnualDetails?.R6000,
              AvgL1: this.audiometryResultAnnualDetails?.AvgL1,
              AvgL2: this.audiometryResultAnnualDetails?.AvgL2,
              AvgR1: this.audiometryResultAnnualDetails?.AvgR1,
              AvgR2: this.audiometryResultAnnualDetails?.AvgR2
            },
            audiometricBaseline: {
              AUBLBaselineId: this.audiometryResultBaseLineDetails?.AUBLBaselineId,
              BaseOrAnnual: this.audiometryResultBaseLineDetails?.BaseOrAnnual,
              R500: this.audiometryResultBaseLineDetails?.R500,
              R1000: this.audiometryResultBaseLineDetails?.R1000,
              R2000: this.audiometryResultBaseLineDetails?.R2000,
              R3000: this.audiometryResultBaseLineDetails?.R3000,
              R4000: this.audiometryResultBaseLineDetails?.R4000,
              R6000: this.audiometryResultBaseLineDetails?.R6000,
              L500: this.audiometryResultBaseLineDetails?.L500,
              L1000: this.audiometryResultBaseLineDetails?.L1000,
              L2000: this.audiometryResultBaseLineDetails?.L2000,
              L3000: this.audiometryResultBaseLineDetails?.L3000,
              L4000: this.audiometryResultBaseLineDetails?.L4000,
              L6000: this.audiometryResultBaseLineDetails?.L6000,
              AvgR1: this.audiometryResultBaseLineDetails?.AvgR1,
              AvgL1: this.audiometryResultBaseLineDetails?.AvgL1,
              AvgR2: this.audiometryResultBaseLineDetails?.AvgR2,
              AvgL2: this.audiometryResultBaseLineDetails?.AvgL2
            },
          });
          this.calculateBaseLineAvgRight();
          this.calculateBaseLineAvgLeft();
          this.calculateAnnualAvgRight();
          this.calculateAnnualAvgLeft();
          // this.viewLineChart();
          this.onSelectChange();
        }
        if(audiometryResultData['status'] == 404) {
          this.getCheckInDateForAudiometric();
        }
      });
  }
  getCheckInDateForAudiometric() {
    const data = {
      employeeID: this.audiometryResultForm.value.audiometricResult.EmployeeId,
      employeeOHSTestVisitId: this.audiometryResultForm.value.audiometricResult.EmployeeOHSTestVisitId
    }
    // console.log(data);

    this.audiometricService.getCheckInDateForAudiometric(data)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((checkInDateResult: any) => {
        console.log(checkInDateResult);
        this.checkInDate = checkInDateResult['DOT'];
        let checkInDt = moment(this.checkInDate, 'DD/MM/YYYY');
        this.audiometricTestGroup.controls.DateOfTest.setValue(checkInDt);
        // console.log(checkInDt);
      });
  }

  calculateBaseLineAvgRight() {
    if (this.baseLineGroup.controls.R500.value > 0 && this.baseLineGroup.controls.R1000.value > 0 && this.baseLineGroup.controls.R2000.value > 0 && this.baseLineGroup.controls.R3000.value > 0) {
      const calculatedValue1 = (Number(this.baseLineGroup.controls.R500.value) + Number(this.baseLineGroup.controls.R1000.value) + Number(this.baseLineGroup.controls.R2000.value) + Number(this.baseLineGroup.controls.R3000.value)) / 4.00;
      const avgBaseLineRightValue1 = parseFloat((calculatedValue1).toFixed(2));
      this.baseLineAvgRight1 = avgBaseLineRightValue1;

      this.baseLineGroup.controls.AvgR1.setValue(this.baseLineAvgRight1);
      this.baseLineGroup.controls.AvgR1.enable();
    }
    if (this.baseLineGroup.controls.R2000.value > 0 && this.baseLineGroup.controls.R3000.value > 0 && this.baseLineGroup.controls.R4000.value > 0) {
      const calculatedValue2 = (Number(this.baseLineGroup.controls.R2000.value) + Number(this.baseLineGroup.controls.R3000.value) + Number(this.baseLineGroup.controls.R4000.value)) / 3.00;
      const avgBaseLineRightValue2 = parseFloat((calculatedValue2).toFixed(2));
      this.baseLineAvgRight2 = avgBaseLineRightValue2;

      this.baseLineGroup.controls.AvgR2.setValue(this.baseLineAvgRight2);
      this.baseLineGroup.controls.AvgR2.enable();
    }
  }
  calculateBaseLineAvgLeft() {
    if (this.baseLineGroup.controls.L500.value > 0 && this.baseLineGroup.controls.L1000.value > 0 && this.baseLineGroup.controls.L2000.value > 0 && this.baseLineGroup.controls.L3000.value > 0) {
      const calculatedValue1 = (Number(this.baseLineGroup.controls.L500.value) + Number(this.baseLineGroup.controls.L1000.value) + Number(this.baseLineGroup.controls.L2000.value) + Number(this.baseLineGroup.controls.L3000.value)) / 4.00;
      const avgBaseLineLeftValue1 = parseFloat((calculatedValue1).toFixed(2));
      this.baseLineAvgLeft1 = avgBaseLineLeftValue1;

      this.baseLineGroup.controls.AvgL1.setValue(this.baseLineAvgLeft1);
      this.baseLineGroup.controls.AvgL1.enable();
    }
    if (this.baseLineGroup.controls.L2000.value > 0 && this.baseLineGroup.controls.L3000.value > 0 && this.baseLineGroup.controls.L4000.value > 0) {
      const calculatedValue2 = (Number(this.baseLineGroup.controls.L2000.value) + Number(this.baseLineGroup.controls.L3000.value) + Number(this.baseLineGroup.controls.L4000.value)) / 3.00;
      const avgBaseLineLeftValue2 = parseFloat((calculatedValue2).toFixed(2));
      this.baseLineAvgLeft2 = avgBaseLineLeftValue2;

      this.baseLineGroup.controls.AvgL2.setValue(this.baseLineAvgLeft2);
      this.baseLineGroup.controls.AvgL2.enable();
    }
  }
  calculateAnnualAvgRight() {
    if (this.annualGroup.controls.R500.value > 0 && this.annualGroup.controls.R1000.value > 0 && this.annualGroup.controls.R2000.value > 0 && this.annualGroup.controls.R3000.value > 0) {
      const calculatedValue1 = (Number(this.annualGroup.controls.R500.value) + Number(this.annualGroup.controls.R1000.value) + Number(this.annualGroup.controls.R2000.value) + Number(this.annualGroup.controls.R3000.value)) / 4.00;
      const avgAnnualRightValue1 = parseFloat((calculatedValue1).toFixed(2));
      this.annualAvgRight1 = avgAnnualRightValue1;

      this.annualGroup.controls.AvgR1.setValue(this.annualAvgRight1);
      this.annualGroup.controls.AvgR1.enable();
    }
    if (this.annualGroup.controls.R2000.value > 0 && this.annualGroup.controls.R3000.value > 0 && this.annualGroup.controls.R4000.value > 0) {
      const calculatedValue2 = (Number(this.annualGroup.controls.R2000.value) + Number(this.annualGroup.controls.R3000.value) + Number(this.annualGroup.controls.R4000.value)) / 3.00;
      const avgAnnualRightValue2 = parseFloat((calculatedValue2).toFixed(2));
      this.annualAvgRight2 = avgAnnualRightValue2;

      this.annualGroup.controls.AvgR2.setValue(this.annualAvgRight2);
      this.annualGroup.controls.AvgR2.enable();
    }
  }
  calculateAnnualAvgLeft() {
    if (this.annualGroup.controls.L500.value > 0 && this.annualGroup.controls.L1000.value > 0 && this.annualGroup.controls.L2000.value > 0 && this.annualGroup.controls.L3000.value > 0) {
      const calculatedValue1 = (Number(this.annualGroup.controls.L500.value) + Number(this.annualGroup.controls.L1000.value) + Number(this.annualGroup.controls.L2000.value) + Number(this.annualGroup.controls.L3000.value)) / 4.00;
      const avgAnnualLeftValue1 = parseFloat((calculatedValue1).toFixed(2));
      this.annualAvgLeft1 = avgAnnualLeftValue1;

      this.annualGroup.controls.AvgL1.setValue(this.annualAvgLeft1);
      this.annualGroup.controls.AvgL1.enable();
    }
    if (this.annualGroup.controls.L2000.value > 0 && this.annualGroup.controls.L3000.value > 0 && this.annualGroup.controls.L4000.value > 0) {
      const calculatedValue2 = (Number(this.annualGroup.controls.L2000.value) + Number(this.annualGroup.controls.L3000.value) + Number(this.annualGroup.controls.L4000.value)) / 3.00;
      const avgAnnualLeftValue2 = parseFloat((calculatedValue2).toFixed(2));
      this.annualAvgLeft2 = avgAnnualLeftValue2;

      this.annualGroup.controls.AvgL2.setValue(this.annualAvgLeft2);
      this.annualGroup.controls.AvgL2.enable();
    }
  }

  noDataCanvas(element: ElementRef) {
    const dpi = window.devicePixelRatio;
    const canvasLeft = ((element.nativeElement.parentElement.clientWidth / 2) - (element.nativeElement.width / 2)) * dpi;
    const canvasTop = (element.nativeElement.height / 2) * dpi;
    this.ctx = element.nativeElement.getContext('2d');
    element.nativeElement.width = element.nativeElement.parentElement.clientWidth * dpi;
    element.nativeElement.height = element.nativeElement.height * dpi;
    this.ctx.font = '18px Montserrat, sans-serif';
    this.ctx.fillText(this.noDataText, canvasLeft, canvasTop);
  }
  createLineChart(element: ElementRef, chartData: any, chartOption: any) {
    this.ctx = element.nativeElement.getContext('2d');
    // console.log('Chart Data:', chartData);
    // console.log('Chart Option', chartOption);

    const lineChart = new Chart(this.ctx, {
      type: 'line',
      data: chartData,
      options: chartOption
    });
  }
  viewLineChart() {
    this.RightBaseLine = [
      { x: 500, y: this.baseLineGroup.controls.R500.value },
      { x: 1000, y: this.baseLineGroup.controls.R1000.value },
      { x: 2000, y: this.baseLineGroup.controls.R2000.value },
      { x: 3000, y: this.baseLineGroup.controls.R3000.value },
      { x: 4000, y: this.baseLineGroup.controls.R4000.value },
      { x: 6000, y: this.baseLineGroup.controls.R6000.value },
      // { x: 8000, y : -75}
    ];
    this.LeftBaseLine = [
      { x: 500, y: this.baseLineGroup.controls.L500.value },
      { x: 1000, y: this.baseLineGroup.controls.L1000.value },
      { x: 2000, y: this.baseLineGroup.controls.L2000.value },
      { x: 3000, y: this.baseLineGroup.controls.L3000.value },
      { x: 4000, y: this.baseLineGroup.controls.L4000.value },
      { x: 6000, y: this.baseLineGroup.controls.L6000.value },
    ];
    if(this.audiometricTestGroup.controls.TypeOfAudiogram.value === 'A') {
      this.RightAnnual = [
        { x: 500, y: this.annualGroup.controls.R500.value },
        { x: 1000, y: this.annualGroup.controls.R1000.value },
        { x: 2000, y: this.annualGroup.controls.R2000.value },
        { x: 3000, y: this.annualGroup.controls.R3000.value },
        { x: 4000, y: this.annualGroup.controls.R4000.value },
        { x: 6000, y: this.annualGroup.controls.R6000.value },
        // { x: 8000, y : -25}
      ];
      this.LeftAnnual = [
        { x: 500, y: this.annualGroup.controls.L500.value },
        { x: 1000, y: this.annualGroup.controls.L1000.value },
        { x: 2000, y: this.annualGroup.controls.L2000.value },
        { x: 3000, y: this.annualGroup.controls.L3000.value },
        { x: 4000, y: this.annualGroup.controls.L4000.value },
        { x: 6000, y: this.annualGroup.controls.L6000.value },
      ];
    } else {
      this.RightAnnual = [];
      this.LeftAnnual = [];
    }
    
    const rightFrequencyData = {
      labels: this.RightBaseLine.map(item => item.x),
      // labels: this.clinicMetrics.DailyMetric.map((item: any) => item.DayOfMonth),
      datasets: [
        {
          label: 'BASELINE',
          // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
          data: this.RightBaseLine.map(item => item.y),
          backgroundColor: '#ff638466',
          borderWidth: 3,
          borderColor: '#ff6384',
          fill: false,
          lineTension: 0,
        },
        {
          label: 'ANNUAL',
          // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
          data: this.RightAnnual.map(item => item.y),
          backgroundColor: '#21cf3c66',
          borderWidth: 2,
          borderDash: [5, 10],
          borderColor: '#21cf3c',
          fill: false,
          lineTension: 0,
        }
      ],

    };
    const leftFrequencyData = {
      labels: this.LeftBaseLine.map(item => item.x),
      // labels: this.clinicMetrics.DailyMetric.map((item: any) => item.DayOfMonth),
      datasets: [
        {
          label: 'BASELINE',
          // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
          data: this.LeftBaseLine.map(item => item.y),
          backgroundColor: '#ff638466',
          borderWidth: 3,
          borderColor: '#ff6384',
          fill: false,
          lineTension: 0,
        },
        {
          label: 'ANNUAL',
          // data: this.clinicMetrics.DailyMetric.map((item: any) => item.TotalPatient),
          data: this.LeftAnnual.map(item => item.y),
          backgroundColor: '#21cf3c66',
          borderWidth: 2,
          borderDash: [5, 10],
          borderColor: '#21cf3c',
          fill: false,
          lineTension: 0,
        }
      ]
    };
    this.createLineChart(this.frequencyChartRightEar, rightFrequencyData, this.lineChartOption);
    this.createLineChart(this.frequencyChartLeftEar, leftFrequencyData, this.lineChartOption);
  }
  btnToggle() {
    this.audiometryResultForm.markAllAsTouched();
    console.log(this.audiometryResultForm);
    this.audiometryResultForm.value.audiometricResult.DateOfTest = this.audiometricTestGroup.controls.DateOfTest.value.format('DD/MM/YYYY');


      if(this.audiometryResultForm.valid) {
      console.log('Valid');

        if(this.btnText === 'Show Graph') { 
        console.log("API Fired");
        const audiometryResultDataPayLoad = {
          // audiometricResult: {
          ...this.audiometryResultForm.value
          // }
        }
        console.log(audiometryResultDataPayLoad);

        this.audiometricService.addEditAudiometricResult(audiometryResultDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            if (this.audiometryResultForm.value.audiometricResult.Id > 0) {
              // this.snackBar.open('Updated Successfully', 'Close', {
              //   panelClass: 'success-popup',
              // });

              this.getAudiometricResultDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getAudiometricResultDetails();
              this.saveNext = true;
            }
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
      }
      
    this.showHide = !this.showHide;

    console.log(this.showHide);

    if (this.showHide) {
      this.btnText = 'Show Graph';
    } else {
      this.btnText = 'Hide Graph';
    }
    } else {
      console.log('Invalid');
      this.snackBar.open('Error!! Required fields need to be filled before viewing the graph.', 'Close', {
        panelClass: 'error-popup',
      });
    }
  }

  onSubmit() {
    this.audiometryResultForm.markAllAsTouched();
    console.log(this.audiometryResultForm);
    this.audiometryResultForm.value.audiometricResult.DateOfTest = this.audiometricTestGroup.controls.DateOfTest.value.format('DD/MM/YYYY');

    if (this.audiometryResultForm.valid) {
      console.log('Valid');
      const audiometryResultDataPayLoad = {
        // audiometricResult: {
        ...this.audiometryResultForm.value
        // }
      }
      console.log(audiometryResultDataPayLoad);

      this.audiometricService.addEditAudiometricResult(audiometryResultDataPayLoad)
        .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((response: any) => {
          if (response['status'] == 200) {
            if (this.audiometryResultForm.value.audiometricResult.Id > 0) {
              this.snackBar.open('Updated Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getAudiometricResultDetails();
              this.updateNext = true;
            } else {
              this.snackBar.open('Saved Successfully', 'Close', {
                panelClass: 'success-popup',
              });

              this.getAudiometricResultDetails();
              this.saveNext = true;
            }
          } else {
            this.snackBar.open('Something went wrong! Please try again.', 'Close', {
              panelClass: 'error-popup',
            });
          }
        });
    } else {
      console.log('Invalid');
      this.snackBar.open('Error!! Required fields need to be filled before Submit.', 'Close', {
        panelClass: 'error-popup',
      });
    }
  }
}























































































































































// const RightBaseLine = [
//   { x: 500, y: 50 },
//   { x: 1000, y: 40.12 },
//   { x: 2000, y: 40 },
//   { x: 3000, y: 35.37 },
//   { x: 4000, y: 45.78 },
//   { x: 6000, y: 85.66 },
//   // { x: 8000, y : -75}
// ];
// const LeftBaseLine = [
//   { x: 500, y: 20 },
//   { x: 1000, y: 25 },
//   { x: 2000, y: 25 },
//   { x: 3000, y: 25 },
//   { x: 4000, y: 35 },
//   { x: 6000, y: 75 },
// ];
// const RightAnnual = [
//   { x: 500, y: 25.75 },
//   { x: 1000, y: 20 },
//   { x: 2000, y: 25 },
//   { x: 3000, y: 20.39 },
//   { x: 4000, y: 30 },
//   { x: 6000, y: 75 },
//   // { x: 8000, y : -25}
// ];
// const LeftAnnual = [
//   { x: 500, y: 25 },
//   { x: 1000, y: 25 },
//   { x: 2000, y: 20 },
//   { x: 3000, y: 20 },
//   { x: 4000, y: 30 },
//   { x: 6000, y: 75 },
// ];















































  // private months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

 // public barChartOption = {
  //   responsive: true,
  //   legend: {
  //     display: false
  //   },
  // };
// const testitem = [
//   {
//     "id": 0,
//     "value": -1200
//   },
//   {
//     "id": 1,
//     "value": 883
//   },
//   {
//     "id": 2,
//     "value": 5925
//   },
//   {
//     "id": 3,
//     "value": 17119
//   },
//   {
//     "id": 4,
//     "value": 27144
//   },
//   {
//     "id": 5,
//     "value": 2758
//   },
//   {
//     "id": 6,
//     "value": -900
//   },
//   {
//     "id": 7,
//     "value": 19000
//   },
//   {
//     "id": 8,
//     "value": -27150
//   }
// ];

// createBarChart(element: ElementRef, chartData: any, chartOption: any) {
  //   this.ctx = element.nativeElement.getContext('2d');
  //   const barChart = new Chart(this.ctx, {
  //     type: 'bar',
  //     data: chartData,
  //     options: chartOption
  //   });
  // }
  // viewBarChart() {
  //   const yearlyPatients = {
  //     // labels: this.clinicMetrics.MonthlyMetric.map((item: any) => this.months[item.MonthOfYear - 1]),
  //     // labels: testitem.map(x => this.months[x.id]),
  //     labels: testitem.map(x => x.id),
  //     datasets: [{
  //       label: 'Monthly Patient Count',
  //       // data: this.clinicMetrics.MonthlyMetric.map((item: any) => item.TotalPatient),
  //       data: testitem.map(x => x.value),
  //       backgroundColor: '#FCE15D',
  //       borderWidth: 1,
  //       borderColor: '#FCE15D',
  //       barPercentage: 0.5,
  //       barThickness: 6,
  //       maxBarThickness: 8,
  //       minBarLength: 2
  //     }]
  //   };
  //   const yearlySales = {
  //     // labels: this.clinicMetrics.MonthlyMetric.map((item: any) => this.months[item.MonthOfYear - 1]),
  //     // labels: testitem.map(x => this.months[x.id]),
  //     labels: testitem.map(x => x.id),
  //     datasets: [{
  //       label: 'Monthly Sales',
  //       // data: this.clinicMetrics.MonthlyMetric.map((item: any) => item.TotalSales),
  //       data: testitem.map(x => x.value),
  //       backgroundColor: '#FCE15D',
  //       borderWidth: 1,
  //       borderColor: '#FCE15D',
  //       barPercentage: 0.5,
  //       barThickness: 6,
  //       maxBarThickness: 8,
  //       minBarLength: 2
  //     }]
  //   };
  //   this.createBarChart(this.yearSalesChart, yearlySales, this.barChartOption);
  //   this.createBarChart(this.yearPatientsChart, yearlyPatients, this.barChartOption);
  // }