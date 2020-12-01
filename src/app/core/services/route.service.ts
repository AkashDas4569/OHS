import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
private routeDataSource = new BehaviorSubject<Object>({});
// private dataStore: { routeDataParam: {} } = { routeDataParam: {} };
// readonly routeDataParam: Observable<Object> = this.routeDataSource.asObservable();

  constructor() { }

  setRouteParamForAudiometric(data: Object) {
    // console.log('RouteService Data: ', data);
    this.routeDataSource.next(data);
  }
  getRouteParamForAudiometricData(): Observable<Object> {
    // return this.routeDataSource.getValue();
    return this.routeDataSource.asObservable();
  }
}
