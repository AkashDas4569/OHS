import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AuthenticationService, OhdService } from '../../../../core/services';

@Component({
  selector: 'ohs-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('deleteUser', { static: true }) public deleteUser!: TemplateRef<any>;
  @Output() deleteUserDataEvent: EventEmitter<any> = new EventEmitter();
  private onDestroyUnSubscribe = new Subject<void>();

  public modalRef!: BsModalRef;
  public userDetails: any;
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

  // Open Bsmodal
  openModal(data: any) {
    this.modalRef = this.modalService.show(this.deleteUser, { class: 'deleteUser-modal modal-dialog-centered' });
    this.userDetails = data;
    // console.log(this.userDetails);
  }
  delete(details: any) {
    this.userId = +(details.Id);
    // console.log(this.userId);
    this.ohdService.deleteUserModule({ ID: this.userId })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if (response['status'] == 200) {
          this.deleteUserDataEvent.emit({ Id: this.userId });
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
