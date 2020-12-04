import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
const moment = _moment;
import { AuthenticationService, LookupService, AudiometricService, RouteService } from '../../../core/services';
import { EmployeeAudiometricQueueStatus } from '../../../core/enums';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ohs-audiometric-test',
  templateUrl: './audiometric-test.component.html',
  styleUrls: ['./audiometric-test.component.scss']
})
export class AudiometricTestComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private audiometricService: AudiometricService,
    private routeService: RouteService
  ) { }

  ngOnInit(): void {
    this.loadAudiometricStatus();
    this.loadEmployeeAudiometricQueue('1');
    this.refreshEmployeeQueue = setInterval(() => {
      this.loadEmployeeAudiometricQueue('0');
    }, 180000);

    this.loadAudiometricQueueStatus();
  }
  ngAfterViewInit() : void {
    this.loadEmployeeAudiometricQueueCheckout();
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    clearInterval(this.refreshEmployeeQueue);
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  onChangeStatus(employeeAudiometricQueue: any) {
    console.log(employeeAudiometricQueue)
    if (employeeAudiometricQueue.SelectedStatus) {
      // if (patientQueue.SelectedStatus === patientQueue.CurrentStatus) {
      this.queueNavigate(employeeAudiometricQueue);
      // }
    } else {
      this.snackBar.open('Please Select a Status to Proceed.', 'Close', {
        panelClass: 'error-popup',
      });
    }
  }

  private queueNavigate(employeeAudiometricQueue: any) {
    console.log(employeeAudiometricQueue.SelectedStatus);
    switch (employeeAudiometricQueue.SelectedStatus) {
      case EmployeeAudiometricQueueStatus.OccupationalNoiseExposure: {
        this.router.navigate(['/audiometric', 'status', 'occupational-noise-exposure', employeeAudiometricQueue.EmpId, employeeAudiometricQueue.EmployeeTestVisitID]);
        this.routeService.setRouteParamForAudiometric(employeeAudiometricQueue);
        break;
      }
      case EmployeeAudiometricQueueStatus.MedicalHistory: {
        this.router.navigate(['/audiometric', 'status', 'medical-history', employeeAudiometricQueue.EmpId, employeeAudiometricQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeAudiometricQueueStatus.AudiometryResults: {
        this.router.navigate(['/audiometric', 'status', 'audiometry-result', employeeAudiometricQueue.EmpId, employeeAudiometricQueue.EmployeeTestVisitID]);
        break;
      }
      case EmployeeAudiometricQueueStatus.CheckOut: {
        this.router.navigate(['/audiometric', 'status', 'checkout', employeeAudiometricQueue.EmpId, employeeAudiometricQueue.EmployeeTestVisitID]);
        break;
      }
      default:
        this.loadEmployeeAudiometricQueue('1');
    }
  }
  loadAudiometricStatus() {
    this.lookupService.getAudiometricStatusList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        result['AudTstStatusList'].forEach((value: any, index: any) => {
          if (value.QStatus === 'CheckIn') {
            // const data = {Id: 1, QStatus: "Akash"}
            result['AudTstStatusList'].splice(index, 1);
          }
        });

        this.queueStatus = result['AudTstStatusList'];
        console.log(this.queueStatus);
      });
  }
  loadAudiometricQueueStatus() {
    this.lookupService.getAudiometricQueueStatusList()
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((result: any) => {
        console.log(result);
      });
  }
  loadEmployeeAudiometricQueue(loader: string) {
    const data = {
      employeeName: '',
      loader
    }
    this.audiometricService.getAllCheckInAudiometricQueue(data)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((employeeAudiometricData: any) => {
        this.allEmployeeQueues = employeeAudiometricData['checkInAud'];
        console.log(this.allEmployeeQueues);

        this.noDataText = 'No Data Found';
      });
  }
  loadEmployeeAudiometricQueueCheckout() {
    const data = {
      employeeName: ''
    }
    this.audiometricService.getAllCheckOutAudiometricQueue(data)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
        .subscribe((employeeMedSurCheckoutData: any) => {
          this.allEmployeeCheckoutQueues = employeeMedSurCheckoutData['checkOutAud'];
          console.log(this.allEmployeeCheckoutQueues);
          this.noDataText = 'No Data Found';
        });
  }
 
  onSubmit() { }
}
