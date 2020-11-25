import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ohs-audiometric-test',
  templateUrl: './audiometric-test.component.html',
  styleUrls: ['./audiometric-test.component.scss']
})
export class AudiometricTestComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();
  constructor(
    // public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  onSubmit() {}


}
