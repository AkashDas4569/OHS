import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../../core/services';
import { NavItems } from '../../../core/utilities';
// RxJs
import { Subject, Observer, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
// import * as moment from 'moment';

@Component({
  selector: 'ohs-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public navItems = NavItems;
  // public isDarkMode = false;
  @Output() closeSideNav = new EventEmitter<string>();
  private onDestroyUnSubscribe = new Subject<void>();
  public userDetails: any;
  public allCategories: any[] = [];
  // public isDarkmodeActive: string;
  // public isCollapsedMedical = true;
  public isCollapsedAudiometric = true;
  public isCollapsedReport = true;
  public isCollapsedOHSClient = true;
  public isCollapsedOHDSettings = true;
  public userRoleId: any;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.userRoleId = this.authenticationService.getUserRolesId();
    console.log(this.userRoleId);
    
    // this.isDarkmodeActive = JSON.parse(localStorage.getItem('isDarkmodeActive'));
    // if (this.isDarkmodeActive) {
    //   this.isDarkMode = true;
    // } else {
    //   this.isDarkMode = false;
    // }

    // this.authenticationService.userDataState
    // .pipe(takeUntil(this.onDestroyUnSubscribe))
    // .subscribe(userData => {
    //   this.userDetails = userData;
    // });
    // this.userDetails = this.authenticationService.loggedInUserData();
    // this.getAllCategories();
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  toggleTheme() {
    // this.isDarkMode = !this.isDarkMode;
    // console.log(this.isDarkMode);
    // localStorage.setItem('isDarkmodeActive', this.isDarkMode.toString());
    // document.body.classList.toggle('theme-dark');
    // document.body.classList.toggle('theme-light');
  }

  // Sidenav Close
  closeSidenav(sideNavId: any) {
    this.closeSideNav.emit(sideNavId);
  }
  
}
