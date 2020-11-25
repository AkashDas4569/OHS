import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { CustomPopupService, AuthenticationService } from '../../../core/services';
// RxJs
import {
  concat,
  Observable,
  of,
  Subject,
  Subscription,
  interval,
  TimeInterval,
  timer
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  takeUntil,
  map,
  startWith,
  take,
  mergeMapTo
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var $: any;

@Component({
  selector: 'ohs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();
  public userName: any;

   constructor(
     private router: Router,
     private route: ActivatedRoute,
     public snackBar: MatSnackBar,
     public customPopupService: CustomPopupService,
     private authenticationService: AuthenticationService
   ) { }
    // Sidenav Open
    openCustomSidenav(id: string) {
     this.customPopupService.open(id);
   }
   // Sidenav Close
   closeCustomSidenav(id: string) {
     this.customPopupService.close(id);
   }
   // Sidenav Close All
   closeAllCustomSidenav() {
     this.customPopupService.closeAll();
   }
 
   ngOnInit(): void {
    this.userName = this.authenticationService.getUserName();
   }
   ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

   logout() {
    // localStorage.clear();
    const data = {};
    this.authenticationService.logOut(data)
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((loggedOut: any) => {
        this.authenticationService.logOutFromDevice();
      });
  }
 
}
