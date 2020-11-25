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
export class AuthGuard implements CanActivate, OnDestroy {
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
    // const data = localStorage.getItem('logged-in');
    // if (data) {
      // this.titleService.setTitle(`${next.data.title} - OHS`);
      // logged in so return true
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  private logout() {
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
