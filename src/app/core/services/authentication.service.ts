import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpParams } from '@angular/common/http';

import { Observable, of, throwError, Subject, timer } from 'rxjs';
import { catchError, map, tap, switchMap, retry } from 'rxjs/operators';
// Handle error
import { HandleError, HandleErrorService } from './handle-error.service';
// Server Link
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
// Content Type
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userDataSubject = new Subject();
  public userDataState = this.userDataSubject.asObservable();
  private handleError: HandleError;
  public apiUrl = environment.SERVER_URL;
  public allLayoutMenus: any[] = [];
  public allRoutes: string[] = [];
  // public allRouteNames: string[] = [];
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,
    private router: Router,
    private httpBackend: HttpBackend
  ) {
    this.handleError = handleErrorService.createHandleError('AuthenticationService');
  }

  // setUserLayoutMenus(data: any[]) {
  //   this.allLayoutMenus = data;
  // }
  // setAllRoutes(data: string[]) {
  //   this.allRoutes = data;
  // }
  // getUserLayoutMenus() {
  //   return this.allLayoutMenus;
  // }
  // getAllRoutes() {
  //   return this.allRoutes;
  // }
  // public isRouteAuthorized(url: string): boolean {
  //   const index = this.allRoutes.length ?  this.allRoutes.findIndex(u => url.indexOf(u.split(':')[0]) !== -1) : 0;
  //   if (index === -1) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  getToken() {
    if (localStorage.getItem('authKey')) {
      return localStorage.getItem('authKey');
    } else {
      return '';
    }
  }
  // getClinicId() {
  //   if (localStorage.getItem('ClinicId')) {
  //     return localStorage.getItem('ClinicId');
  //   } else {
  //     return '';
  //   }
  // }
  // getClinicGroupId() {
  //   if (localStorage.getItem('ClinicGroupId')) {
  //     return localStorage.getItem('ClinicGroupId');
  //   } else {
  //     return '';
  //   }
  // }
  // getIsClinicShared() {
  //     return localStorage.getItem('isClinicShared') ? JSON.parse((localStorage.getItem('isClinicShared') as string)) : false;
  //   // if (localStorage.getItem('isClinicShared')) {
  //   //   return localStorage.getItem('isClinicShared');
  //   // } else {
  //   //   return '';
  //   // }
  // }
  // getGroupName() {
  //   if (localStorage.getItem('groupName')) {
  //     return localStorage.getItem('groupName');
  //   } else {
  //     return '';
  //   }
  // }
  getClinicId() {
    if (localStorage.getItem('OHDClinicId')) {
      return localStorage.getItem('OHDClinicId');
    } else {
      return '';
    }
  }
  // getClinicName() {
  //   if (localStorage.getItem('ClinicName')) {
  //     return localStorage.getItem('ClinicName');
  //   } else {
  //     return '';
  //   }
  // }
  getUserLoggedInID() {
    if (localStorage.getItem('Id')) {
      return localStorage.getItem('Id');
    } else {
      return '';
    }
  }
  getStatus() {
    if (localStorage.getItem('Active')) {
      return localStorage.getItem('Active');
    } else {
      return '';
    }
  }
  getUserRolesId() {
    if (localStorage.getItem('UserRoleId')) {
      return localStorage.getItem('UserRoleId');
    } else {
      return '';
    }
  }
  getUserID() {
    if (localStorage.getItem('UserID')) {
      return localStorage.getItem('UserID');
    } else {
      return '';
    }
  }
  getUserName() {
    if (localStorage.getItem('UserName')) {
      return localStorage.getItem('UserName');
    } else {
      return '';
    }
  }
  // Check user loggedin
  // loggedInUserData(): any {
  //   return JSON.parse(localStorage.getItem('ehrUser'));
  // }

  login(userData: any) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/Login`;
    return this.http.post(apiPath, userData, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('login'))
      );
  }

  // getGuardAssingedMenusByUserRole(data: any): Observable<boolean> {
  //   const apiPath = `${this.apiUrl}/AuthMucModule/GetAssingedMenusByUserRole`;
  //   return this.http.post(apiPath, data, httpOptions)
  //     .pipe(
  //       // map(response => response),
  //       // catchError(this.handleError('getGuardRolesAndAssignedMenu')),
  //       map((response: any) =>  {
  //         if (response) {
  //           const allMenus = response.LayoutMenus;
  //           allMenus.map((item: any) => {
  //             if (item.Module === 'Main') {
  //               item = Object.assign(item, item.SubMenu[0]);
  //               item.Icon = `assets/img/header-icons/dashboard.png`;
  //             } else {
  //               item.Name = item.Module;
  //               item.Icon = `assets/img/header-icons/${item.Module.toLowerCase().replace(/[\+\ )(]/g, '-')}.png`;
  //               item.URL = `/${ item.SubMenu[0].URL.split('/')[1] }`;
  //             }
  //           });
  //           this.setUserLayoutMenus(allMenus);
  //           this.setAllRoutes(response.Routes);
  //           return true;
  //         } else {
  //           return true;
  //         }
  //       }),
  //       catchError(
  //         (err) => {
  //           return of(false);
  //         }
  //       )
  //     );
  // }

  // dashboardHeaderDetails(data: any) {
  //   const apiPath = `${this.apiUrl}/Dashboard/DashboardHeaderDetails`;
  //   return this.http.post(apiPath, data, httpOptions)
  //     .pipe(
  //       map(response => response),
  //       catchError(this.handleError('dashboardHeaderDetails'))
  //     );
  // }


  // logout
  logOut(data: any) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/Logout`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        // catchError(this.handleError('login'))
      );
  }

  logOutFromDevice() {
    localStorage.clear();
    this.userDataSubject.next();
    this.router.navigate(['/login']);
  }
  checkIsValidUserId(data: any) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/IsUserExist`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('checkIsValidUserId'))
      );
  }
  changeUserPassword(data: any) {
    const apiPath = `${this.apiUrl}/AuthOHSModule/UpdatePassword`;
    return this.http.post(apiPath, data, httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError('changeUserPassword'))
      );
  }

}
