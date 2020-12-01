import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, MedicalSurveillanceService } from '../../../core/services';
import { EmployeeMedSurQueueStatus } from '../../../core/enums';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'ohs-medical-surveillance-list',
  templateUrl: './medical-surveillance-list.component.html',
  styleUrls: ['./medical-surveillance-list.component.scss']
})
export class MedicalSurveillanceListComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();
  link: any;

  public datestr: string = '';
  public date = new Date().toISOString();
  public allEmployeeQueues: any;
  public allEmployeeCheckoutQueues: any;
  public queueStatus: any;
  public noDataText: string = `Please wait while we're fetching your data...`;
  public refreshEmployeeQueue: any;
  public status!: string;
  public searchTitle!: string;

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private lookupService: LookupService,
    private medicalSurveillanceService: MedicalSurveillanceService
  ) { }

  ngOnInit(): void {
    this.loadMedicalSurStatus();
    this.loadEmployeeMedSurQueue('1');
    this.loadEmployeeMedSurQueueCheckout();
    this.refreshEmployeeQueue = setInterval(() => {
      this.loadEmployeeMedSurQueue('0');
      // this.loadEmployeeMedSurQueueCheckout();
    }, 180000);

    this.loadMedicalSurQueueStatus();
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    clearInterval(this.refreshEmployeeQueue);
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  onChangeStatus(employeeMedQueue: any) {
    console.log(employeeMedQueue)
    if (employeeMedQueue.SelectedStatus) {
      // if (patientQueue.SelectedStatus === patientQueue.CurrentStatus) {
        this.queueNavigate(employeeMedQueue);
      // }
    } else {
      this.snackBar.open('Please Select a Status to Proceed.', 'Close', {
        panelClass: 'error-popup',
      });
    }
  }

  private queueNavigate(employeeMedQueue: any) {
    console.log(employeeMedQueue.SelectedStatus);
    switch(employeeMedQueue.SelectedStatus) {
      case EmployeeMedSurQueueStatus.MedicalCondition: {
        this.router.navigate(['/medical-surveillance', 'status', 'medical-condition', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.PastMedicalHistory: {
        this.router.navigate(['/medical-surveillance', 'status', 'past-medical-history', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.FamilyHistory: {
        this.router.navigate(['/medical-surveillance', 'status', 'family-history', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.OccupationalHistory: {
         this.router.navigate(['/medical-surveillance', 'status', 'occupational-history', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.ChemicalHistoryExposure: {
         this.router.navigate(['/medical-surveillance', 'status', 'chemical-history', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.PhysicalExam: {
         this.router.navigate(['/medical-surveillance', 'status', 'physical-exam', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.InvestigationEmployeeSign: {
         this.router.navigate(['/medical-surveillance', 'status', 'investigation', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.ExamOutcomeRecord: {
         this.router.navigate(['/medical-surveillance', 'status', 'exam-outcome-record', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.MedicalRecordBook: {
         this.router.navigate(['/employee', 'status', 'medical-record-book', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      // case EmployeeMedSurQueueStatus.FitnessCertificate: {
      //    this.router.navigate(['/medical-surveillance', 'status', 'fitness-certificate']);
      //   break;
      // }
      case EmployeeMedSurQueueStatus.CheckOut: {
        this.router.navigate(['/medical-surveillance', 'status', 'checkout', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      default:
        this.loadEmployeeMedSurQueue('1');
    }
  }
  loadMedicalSurStatus() {
    this.lookupService.getMedicalSurveillanceStatusList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
       result['AudTstStatusList'].forEach((value : any, index: any) => {
          if(value.QStatus === 'CheckIn') {
            // const data = {Id: 1, QStatus: "Akash"}
            result['AudTstStatusList'].splice(index, 1);
          }
        });
        
        this.queueStatus = result['AudTstStatusList'];
        console.log(this.queueStatus);
    });
  }
  loadMedicalSurQueueStatus() {
    this.lookupService.getMedicalSurveillanceQueueStatusList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        console.log(result);
    });
  }
  
  loadEmployeeMedSurQueue(loader: string) {
    const data = {
      employeeName: '',
      loader
    }
    this.medicalSurveillanceService.getAllCheckInMedSurQueue(data)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((employeeMedSurData: any) => {
          this.allEmployeeQueues = employeeMedSurData['checkInMedQ'];
          console.log(this.allEmployeeQueues);
          this.noDataText = 'No Data Found';
        });
  }
  loadEmployeeMedSurQueueCheckout() {
    const data = {
      employeeName: ''
    }
    this.medicalSurveillanceService.getAllCheckOutMedSurQueue(data)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((employeeMedSurCheckoutData: any) => {
          this.allEmployeeCheckoutQueues = employeeMedSurCheckoutData['checkOutMedQ'];
          console.log(this.allEmployeeCheckoutQueues);
          this.noDataText = 'No Data Found';
        });
  }
  onSubmit() {}
}
