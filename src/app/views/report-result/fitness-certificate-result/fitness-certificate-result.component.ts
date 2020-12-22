import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, ReportsService, OhdService } from '../../../core/services';
// RxJs
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'ohs-fitness-certificate-result',
  templateUrl: './fitness-certificate-result.component.html',
  styleUrls: ['./fitness-certificate-result.component.scss']
})
export class FitnessCertificateResultComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();

  public employeeId: number = 0;
  public doctorId: number = 0;
  public employeeTestVisitId: number = 0;
  public date = new Date().toISOString();
  public medicalCertificateFitnessDetails: any = {};
  public empAddress: any;
  public clinicAddress: any;
  public allOhdClinic: any;

  websiteLogo: any = '/assets/img/Logo.png';

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private reportsService: ReportsService,
    private ohdService: OhdService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['eId'];
      this.employeeTestVisitId = +params['eTestVisitId'];

      console.log('employeeId: ', this.employeeId);
      console.log('employeeTestVisitId: ', this.employeeTestVisitId);
    });

    this.getMedicalCertificateFitnessReport();
    this.getOhdClinic();
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

 getMedicalCertificateFitnessReport() {
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
        console.log('Medical Certificate ==>', this.medicalCertificateFitnessDetails);

        this.empAddress = [this.medicalCertificateFitnessDetails?.Addr1, this.medicalCertificateFitnessDetails?.City, this.medicalCertificateFitnessDetails?.State];

        this.empAddress = this.empAddress.filter((item: any) => item).join(', ');
        console.log('Emp Address', this.empAddress);
      }
    });  
  }
  getOhdClinic() {
    this.ohdService.getOhdClinic({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((allOhdClinic: any) => {
        this.allOhdClinic = allOhdClinic['ohdClinic'];
        console.log(this.allOhdClinic);

        this.clinicAddress = [this.allOhdClinic.cAddr1, this.allOhdClinic.cAddr2, this.allOhdClinic.cCity, this.allOhdClinic.cPostCode, this.allOhdClinic.cState];
        this.clinicAddress = this.clinicAddress.filter((item:any) => item).join(', ');

        console.log('Clinic Address', this.clinicAddress);
      });
  }
  downloadPdf() {
    console.log('Pdf Download');
    window.print();
  }
  closePdf() {
    window.close();
  }
}
