import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, AbstractControl, Validators, AsyncValidatorFn, FormGroupDirective } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { MaritalStatus, Gender, Relationship } from '../../../core/utilities';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, EmployeeService, AudiometricService, OhdService } from '../../../core/services';
// RxJs
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import * as Chart from 'chart.js';

@Component({
  selector: 'ohs-audiometric-report-result',
  templateUrl: './audiometric-report-result.component.html',
  styleUrls: ['./audiometric-report-result.component.scss']
})
export class AudiometricReportResultComponent implements OnInit, OnDestroy {
  @ViewChild('pdfTable') pdfTable!: ElementRef;
  @ViewChild('frequencyChartLeftEar', { static: true }) frequencyChartLeftEar!: ElementRef;
  @ViewChild('frequencyChartRightEar', { static: true }) frequencyChartRightEar!: ElementRef;
  private onDestroyUnSubscribe = new Subject<void>();

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public date = new Date().toISOString();
  public canvas: any;
  public ctx: any;
  public noDataText: string = `Please wait while we're fetching your data...`;
  public gender: any;
  public employeeDetails: any = {};
  public employeeDetailsById: any = {};
  public occupationalNoiseDetails: any = {};
  public medicalHistoryDetails: any = {};
  public audiometryResultDetails: any = {};
  public audiometryResultBaseLineDetails: any = {};
  public audiometryResultAnnualDetails: any = {};
  public allOhdClinic: any = {};
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

  websiteLogo: any = '/assets/img/Logo.png';


  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private audiometricService: AudiometricService,
    private ohdService: OhdService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];

      console.log('employeeId: ', this.employeeId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
    });

    this.getAudiometricDetails();

    this.noDataCanvas(this.frequencyChartLeftEar);
    this.noDataCanvas(this.frequencyChartRightEar);
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getAudiometricDetails() {
    // General Information API
    this.employeeService.getEmployeeDetailsById({ employeeID: this.employeeId })
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((response: any) => {
      if(response['status'] == 200) {
        this.employeeDetails = response['employeeDetails'];
        // this.dobFormatted = moment(this.employeeDetails.DateOfBirth, 'DD/MM/YYYY');
        this.gender = ((this.employeeDetails.Gender === 'M') ? 'Male' : 'Female');
        // this.maritalStatus = ((this.employeeDetails.MartialStatus === 'S') ? 'Single' : 'Married');

        console.log(this.employeeDetails);
      }
    });

    // Employee Details By Id
    this.employeeService.getEmployeeById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        this.employeeDetailsById = result['employeeDataForMedicalConditionModel'];
        console.log(this.employeeDetailsById);
      });

    // Occupational Noise Exposure
    const occupationalNoiseExposure = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(occupationalNoiseExposure);

    this.audiometricService.getOccupationalNoiseExposureDetails(occupationalNoiseExposure)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((occupationalNoiseExposureData: any) => {
        if (occupationalNoiseExposureData['status'] == 200) {
          this.occupationalNoiseDetails = occupationalNoiseExposureData['occupationalNoiseExpo'];
          console.log('occupationalNoiseExpo', this.occupationalNoiseDetails);
        }
      });

    // Medical History
    const medicalHistory = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(medicalHistory);

    this.audiometricService.getMedicalHistoryDetails(medicalHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalHistoryData: any) => {
        if (medicalHistoryData['status'] == 200) {
          this.medicalHistoryDetails = medicalHistoryData['auMedHistory'];
          console.log('MedicalHistory', this.medicalHistoryDetails);
        }
      });
      
      // Audiometric Test Results
      const audiometricResult = {
        employeeID: this.employeeId,
        employeeOHSTestVisitId: this.employeeTestVisitId
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
            console.log('Audiometric Result Details', this.audiometryResultDetails);
            console.log('Audiometric Baseline Details', this.audiometryResultBaseLineDetails);
            console.log('Audiometric Annual Details', this.audiometryResultAnnualDetails);
          }

          this.viewLineChart();
        });

      // Clinic API
      this.ohdService.getOhdClinic({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allOhdClinic: any) => {
        this.allOhdClinic = allOhdClinic['ohdClinic'];
        console.log('Clinic API', this.allOhdClinic);
      });
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
      { x: 500, y: this.audiometryResultBaseLineDetails.R500 },
      { x: 1000, y: this.audiometryResultBaseLineDetails.R1000 },
      { x: 2000, y: this.audiometryResultBaseLineDetails.R2000 },
      { x: 3000, y: this.audiometryResultBaseLineDetails.R3000 },
      { x: 4000, y: this.audiometryResultBaseLineDetails.R4000 },
      { x: 6000, y: this.audiometryResultBaseLineDetails.R6000 },
    ];
    this.LeftBaseLine = [
      { x: 500, y: this.audiometryResultBaseLineDetails.L500 },
      { x: 1000, y: this.audiometryResultBaseLineDetails.L1000 },
      { x: 2000, y: this.audiometryResultBaseLineDetails.L2000 },
      { x: 3000, y: this.audiometryResultBaseLineDetails.L3000 },
      { x: 4000, y: this.audiometryResultBaseLineDetails.L4000 },
      { x: 6000, y: this.audiometryResultBaseLineDetails.L6000 },
    ];
    if(this.audiometryResultDetails.TypeOfAudiogram === 'A') {
      this.RightAnnual = [
        { x: 500, y: this.audiometryResultAnnualDetails.R500 },
        { x: 1000, y: this.audiometryResultAnnualDetails.R1000 },
        { x: 2000, y: this.audiometryResultAnnualDetails.R2000 },
        { x: 3000, y: this.audiometryResultAnnualDetails.R3000 },
        { x: 4000, y: this.audiometryResultAnnualDetails.R4000 },
        { x: 6000, y: this.audiometryResultAnnualDetails.R6000 },
      ];
      this.LeftAnnual = [
        { x: 500, y: this.audiometryResultAnnualDetails.L500 },
        { x: 1000, y: this.audiometryResultAnnualDetails.L1000 },
        { x: 2000, y: this.audiometryResultAnnualDetails.L2000 },
        { x: 3000, y: this.audiometryResultAnnualDetails.L3000 },
        { x: 4000, y: this.audiometryResultAnnualDetails.L4000 },
        { x: 6000, y: this.audiometryResultAnnualDetails.L6000 },
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


  downloadPdf() {
    console.log('Pdf Download');
    window.print();
  }
  closePdf() {
    window.close();
  }
}
