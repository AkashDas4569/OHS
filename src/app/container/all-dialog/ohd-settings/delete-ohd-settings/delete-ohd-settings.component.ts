import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AuthenticationService, OhdService } from '../../../../core/services';

@Component({
  selector: 'ohs-delete-ohd-settings',
  templateUrl: './delete-ohd-settings.component.html',
  styleUrls: ['./delete-ohd-settings.component.scss']
})
export class DeleteOhdSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('deleteOhdSettings', { static: true }) public deleteOhdSettings!: TemplateRef<any>;
  @Output() deleteOhdSettingsDataEvent: EventEmitter<any> = new EventEmitter();
  private onDestroyUnSubscribe = new Subject<void>();

  public modalRef!: BsModalRef;
  public ohdDetails: any;
  public userId!: number;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private ohdService: OhdService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  openModal(data: any) {
    this.modalRef = this.modalService.show(this.deleteOhdSettings, { class: 'deleteUser-modal modal-dialog-centered' });
    this.ohdDetails = data;
    // console.log(this.ohdDetails);
  }
  delete(details: any) {
    this.userId = +(details.Id);
    // console.log(this.userId);
    this.ohdService.deleteOhdModule({ ID: this.userId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if (response['status'] == 200) {
          this.deleteOhdSettingsDataEvent.emit({ Id: this.userId });
          this.modalRef.hide();
          this.snackBar.open('Deleted Successfully', 'Close', {
            panelClass: 'success-popup',
          });
        } else {
          this.snackBar.open('Something went wrong! Please try again.', 'Close', {
            panelClass: 'error-popup',
          });
        }
      });
  }

}
