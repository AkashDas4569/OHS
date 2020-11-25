import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoaderService } from '../../../core/services';
import { LoaderState } from '../../../core/interfaces';
// RxJs
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ohs-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  public show = false;
  public fullScreenLoaderState = false;
  public percentage = 5;
  private onDestroyUnSubscribe = new Subject<void>();

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loaderState
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((state: LoaderState) => {
      // console.log(state);
      if (!state.show && !this.fullScreenLoaderState) {
        document.body.classList.remove('overflow-hidden');
      } else {
        document.body.classList.add('overflow-hidden');
      }
      this.show = state.show;
      this.percentage = state.percentage;
    });
    this.loaderService.fullScreenLoaderState
    .pipe(takeUntil(this.onDestroyUnSubscribe))
    .subscribe((state: LoaderState) => {
      // console.log(state);
      if (!state.show && !this.show) {
        document.body.classList.remove('overflow-hidden');
      } else {
        document.body.classList.add('overflow-hidden');
      }
      this.fullScreenLoaderState = state.show;
    });
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }
}
