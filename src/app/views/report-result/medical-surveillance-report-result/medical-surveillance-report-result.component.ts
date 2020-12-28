import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, EmployeeService, MedicalSurveillanceService, OhdService, ReportsService } from '../../../core/services';
// RxJs
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';

//Pdf Viewer and Convertor
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");

@Component({
  selector: 'ohs-medical-surveillance-report-result',
  templateUrl: './medical-surveillance-report-result.component.html',
  styleUrls: ['./medical-surveillance-report-result.component.scss']
})
export class MedicalSurveillanceReportResultComponent implements OnInit, OnDestroy {
  @ViewChild('pdfTable') pdfTable!: ElementRef;
  private onDestroyUnSubscribe = new Subject<void>();

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public date = new Date().toISOString();
  public maxDate = moment();
  public ethnicList: any[] = [];
  public dobFormatted: any;
  public symptomsDateFormatted: any;
  public gender: any;
  public ethnicId: any;
  public ethnicName: any;
  public maritalStatus: any;
  public employeeDetails: any = {};
  public medicalConditionDetails: any = {};
  public pastMedicalHistoryDetails: any = {};
  public familyHistoryDetails: any = {};
  public occupationalHistoryDetails: any = {};
  public chemicalHistoryDetails: any = {};
  public physicalExamDetails: any = {};
  public investigationDetails: any = {};
  public examOutcomeDetails: any = {};
  public medicalRecordBookDetails: any = {};
  public allOhdClinic: any = {};
  public medicalCertificateFitnessDetails: any = {};

  websiteLogo: any = '/assets/img/Logo.png';

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private medicalSurveillanceService: MedicalSurveillanceService,
    private ohdService: OhdService,
    private reportsService: ReportsService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];

      // console.log('employeeId: ', this.employeeId);
      // console.log('employeeTestVisitId: ', this.employeeTestVisitId);
    });

    this.getMedicalSurveillanceDetails();
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  getEthnicList() {
    this.lookupService.getEthnicList({})
      .subscribe((ethnicList: any) => {
        this.ethnicList = ethnicList['CountryList'];

        // console.log('Ethnic List ==>', this.ethnicList);
      });
  }
  getMedicalSurveillanceDetails() {
    this.getEthnicList();

    // General Information API
    this.employeeService.getEmployeeDetailsById({ employeeID: this.employeeId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if (response['status'] == 200) {
          this.employeeDetails = response['employeeDetails'];
          this.dobFormatted = moment(this.employeeDetails.DateOfBirth, 'DD/MM/YYYY');
          this.gender = ((this.employeeDetails.Gender === 'M') ? 'Male' : 'Female');
          this.maritalStatus = ((this.employeeDetails.MartialStatus === 'S') ? 'Single' : 'Married');
          this.ethnicId = +(this.employeeDetails.Ethnic);
          // console.log('Ethinic Id ==>', this.ethnicId);

          // console.log('Ethnic List ==>', this.ethnicList);
          this.ethnicList;
          this.ethnicName = this.ethnicList.filter((item: any) => item.Id === this.ethnicId).map((item: any) => item.Name);

          // console.log('Selected Ethnic Name ::', this.ethnicName);
          // console.log('Employee Details ==>', this.employeeDetails);
        }
      });

    // Medical Condition API
    const medicalConditionDataPayLoad = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(medicalConditionDataPayLoad);

    this.medicalSurveillanceService.getMedicalConditionDetails(medicalConditionDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalConditionData: any) => {
        if (medicalConditionData['status'] == 200) {
          this.medicalConditionDetails = medicalConditionData['msMedCond'];
          // console.log(this.medicalConditionDetails);
        }
      });

    // Past Medical History API
    const pastMedicalHistory = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(pastMedicalHistory);

    this.medicalSurveillanceService.getPastMedicalHistoryDetails(pastMedicalHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((pastMedicalHistoryData: any) => {
        if (pastMedicalHistoryData['status'] == 200) {
          this.pastMedicalHistoryDetails = pastMedicalHistoryData['msPastMedHistory'];
          // console.log(this.pastMedicalHistoryDetails);
        }
      });

    // Family History API
    const familyHistory = {
      employeeID: this.employeeId,
    }
    // console.log(familyHistory);

    this.medicalSurveillanceService.getFamilyHistoryDetails(familyHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((familyHistoryData: any) => {
        if (familyHistoryData['status'] == 200) {
          this.familyHistoryDetails = familyHistoryData['familyHistory'];
          // console.log(this.familyHistoryDetails);
        }
      });

    // Occupational History API
    const occupationalHistory = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(occupationalHistory);

    this.medicalSurveillanceService.getOccupationalHistoryDetails(occupationalHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((occupationalHistoryData: any) => {
        if (occupationalHistoryData['status'] == 200) {
          this.occupationalHistoryDetails = occupationalHistoryData['occupationalHistory'];
          // console.log(this.occupationalHistoryDetails);
        }
      });

    // Chemical History API
    const chemicalHistory = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(chemicalHistory);

    this.medicalSurveillanceService.getChemicalHistoryDetails(chemicalHistory)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((chemicalHistoryData: any) => {
        if (chemicalHistoryData['status'] == 200) {
          this.chemicalHistoryDetails = chemicalHistoryData['msChemicalHistory'];
          this.symptomsDateFormatted = moment(this.chemicalHistoryDetails.SymptomsDateStr, 'DD/MM/YYYY');

          // console.log(this.chemicalHistoryDetails);
        }
      });

    // Physical Exam. API
    const physicalExam = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(physicalExam);

    this.medicalSurveillanceService.getPhysicalExamDetails(physicalExam)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((physicalExamData: any) => {
        if (physicalExamData['status'] == 200) {
          this.physicalExamDetails = physicalExamData['msPhysicalExam'];
          // console.log('Physical Exam ==>', this.physicalExamDetails);
        }
      });

    // Investigation API
    const investigation = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(investigation);

    this.medicalSurveillanceService.getInvestigationDetails(investigation)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((investigationData: any) => {
        if (investigationData['status'] == 200) {
          this.investigationDetails = investigationData['labInvestigation'];
          // console.log('Investigation ==>', this.investigationDetails);
        }
      });

    // Exam Outcome and Record API
    const examOutcome = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(examOutcome);

    this.medicalSurveillanceService.getExamOutComeDetails(examOutcome)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((examOutcomeData: any) => {
        if (examOutcomeData['status'] == 200) {
          this.examOutcomeDetails = examOutcomeData['examOutcome'];
          // console.log('Exam Outcome ==>', this.examOutcomeDetails);
        }
      });

    // Employee Medical Record Book
    const medicalRecordBook = {
      employeeID: this.employeeId,
      employeeOHSTestVisitId: this.employeeTestVisitId
    }
    // console.log(medicalRecordBook);

    this.medicalSurveillanceService.getRecordBookDetails(medicalRecordBook)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalRecordBookData: any) => {
        if (medicalRecordBookData['status'] == 200) {
          this.medicalRecordBookDetails = medicalRecordBookData['msRecordBook'];
          // console.log('Medical Record Book ==>', this.medicalRecordBookDetails);
        }
      });

    // Clinic API
    this.ohdService.getOhdClinic({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allOhdClinic: any) => {
        this.allOhdClinic = allOhdClinic['ohdClinic'];
        // console.log('Clinic API', this.allOhdClinic);
      });

      // CertificateFitness API
      const medicalCertificateFitness = {
        employeeID: this.employeeId,
        employeeOHSTestVisitId: this.employeeTestVisitId
      }
      // console.log(medicalCertificateFitness);
   
      this.reportsService.getMedicalCertificateFitnessReport(medicalCertificateFitness)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((medicalCertificateFitnessData: any) => {
        if (medicalCertificateFitnessData['status'] == 200) {
          this.medicalCertificateFitnessDetails = medicalCertificateFitnessData['MedicalCertificate'];
          // console.log('Medical Certificate ==>', this.medicalCertificateFitnessDetails);
        }
      });
  }

  downloadPdf() {
    // console.log('Pdf Download');
    window.print();

    // console.log(pdfMake);
    // const documentDefinition = this.getDocumentDefinition();
    //get table html
    // const pdfTable = this.pdfTable.nativeElement;
    // html2canvas(pdfTable).then((canvas: any) => {
    //   console.log(canvas);

    //   // var imgWidth = 209;
    //   // var pageHeight = 295;
    //   console.log('Window Width: ', window.innerWidth + " " + 'Window Height: ', window.innerHeight);
    //   console.log('Canvas Width: ', canvas.width + " " + 'Canvas Height: ', canvas.height);

    //   if ((canvas.width  > window.innerWidth) || (canvas.height > window.innerHeight))
    //   {
    //       var imgWidth = 209;
    //       var pageHeight = 295;
    //       var imgHeight = canvas.height * imgWidth / canvas.width;
    //       var heightLeft = imgHeight;

    //       var contentDataURL = canvas.toDataURL('image/png');

    //       const doc = new jsPDF('p', 'mm');
    //       var pos = 0;
    //       doc.addImage(contentDataURL, 'PNG', 0, pos, imgWidth, imgHeight+15);
    //       heightLeft -= pageHeight;

    //       while (heightLeft >= 0) {
    //       pos = heightLeft - imgHeight;
    //       doc.addPage();
    //       doc.addImage(contentDataURL, 'PNG', 0, pos, imgWidth, imgHeight + 15);
    //       heightLeft -= pageHeight;
    //       }

    //       // doc.save('saveWeb.pdf'); 
    //   } else {
    //     canvas.width  = window.innerWidth;
    //     canvas.height = window.innerHeight;
    //     var imgWidth = 209;
    //     var pageHeight = 295;
    //         var imgHeight = canvas.height * imgWidth / canvas.width;
    //         var heightLeft = imgHeight;

    //         var contentDataURL = canvas.toDataURL('image/png');

    //         const doc = new jsPDF('p', 'mm', 'a4');

    //         doc.addImage(contentDataURL, 0, 0, imgWidth, imgHeight);
    //         // doc.save('saveMobile.pdf'); 
    //   }
    // });
  }
  closePdf() {
    window.close();
  }

}
