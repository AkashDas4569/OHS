import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<LoaderState>();
  public loaderState = this.loaderSubject.asObservable();

  private fullScreenLoaderSubject = new Subject<LoaderState>();
  public fullScreenLoaderState = this.fullScreenLoaderSubject.asObservable();

  constructor() { }

  show(percentage: number, type?: number) {
    this.loaderSubject.next({ show: true, percentage, type } as LoaderState);
  }
  hide() {
    this.loaderSubject.next({ show: false, percentage: 0, type: 0 } as LoaderState);
  }
  showFullScreenLoader() {
    this.fullScreenLoaderSubject.next({ show: true } as LoaderState);
  }
  hideFullScreenLoader() {
    this.fullScreenLoaderSubject.next({ show: false } as LoaderState);
  }
}
