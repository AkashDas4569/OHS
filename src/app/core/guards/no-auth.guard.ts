import { Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { AuthenticationService } from './../services';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
// CanActivate, CanDeactivate<unknown>, CanLoad
export class NoAuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title
  ) { }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(state.url, next.data.title);
    if (!this.authenticationService.getToken()) {
      this.titleService.setTitle(`${next.data.title} - OHS`);
      // Not logged so return true
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
