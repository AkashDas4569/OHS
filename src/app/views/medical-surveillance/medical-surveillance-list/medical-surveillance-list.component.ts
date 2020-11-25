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
  public queueStatus: any;
  public noDataText: string = `Please wait while we're fetching your data...`;
  public refreshEmployeeQueue: any;

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
    this.refreshEmployeeQueue = setInterval(() => {
      this.loadEmployeeMedSurQueue('0');
    },180000)
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
    }
  }

  private queueNavigate(employeeMedQueue: any) {
    console.log(employeeMedQueue.SelectedStatus);
    switch(employeeMedQueue.SelectedStatus) {
      // case EmployeeMedSurQueueStatus.CheckIn: {
      //   console.log('case 1')
      //   break;
      // }
      case EmployeeMedSurQueueStatus.MedicalCondition: {
        this.router.navigate(['/medical-surveillance', 'status', 'medical-condition', employeeMedQueue.EmpId, employeeMedQueue.DoctorID, employeeMedQueue.EmployeeTestVisitID, employeeMedQueue.Gender]);
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
         this.router.navigate(['/medical-surveillance', 'status', 'physical-exam', employeeMedQueue.EmpId, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.InvestigationEmployeeSign: {
         this.router.navigate(['/medical-surveillance', 'status', 'investigation', employeeMedQueue.EmpId, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.ExamOutcomeRecord: {
         this.router.navigate(['/medical-surveillance', 'status', 'exam-outcome-record', employeeMedQueue.EmpId, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.MedicalRecordBook: {
         this.router.navigate(['/employee', 'status', 'medical-record-book', employeeMedQueue.EmpId, employeeMedQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeMedSurQueueStatus.FitnessCertificate: {
         this.router.navigate(['/medical-surveillance', 'status', 'fitness-certificate']);
        break;
      }
      case EmployeeMedSurQueueStatus.CheckOut: {
        console.log('case 12')
        break;
      }
      default:
        this.loadEmployeeMedSurQueue('1');
    }
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
  loadMedicalSurStatus() {
    this.lookupService.getMedicalSurveillanceStatusList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        this.queueStatus = result['AudTstStatusList'];
        console.log(this.queueStatus);
    });
  }
  onSubmit() {}
}
