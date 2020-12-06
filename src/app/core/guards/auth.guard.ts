import { Injectable, OnDestroy } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree, Router
} from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap, takeUntil, filter } from 'rxjs/operators';
import { AuthenticationService } from './../services';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
// CanActivateChild, CanDeactivate<unknown>, CanLoad
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticationService.getToken()) {
    // console.log(state.url, next.data.title);
    // const data = localStorage.getItem('logged-in');
    // if (data) {
      // this.titleService.setTitle(`${next.data.title} - OHS`);
      // logged in so return true
      return true;
    } else {
      this.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(state.url, next.data.title);
    if (this.authenticationService.getToken()) {
      this.titleService.setTitle(`${next.data.title} - OHS`);
      // Not logged so return true
      return true;
    } else {
      this.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
  private logout() {
    console.log('Logout');
    this.authenticationService.logOut({})
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((loggedOut: any) => {
          this.authenticationService.logOutFromDevice();
        }
      );
  }

  ngOnDestroy() {
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }
}
