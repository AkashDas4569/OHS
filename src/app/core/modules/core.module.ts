import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared.module';
import { UrlSerializer } from '@angular/router';
import { CustomUrl } from '../classes';

import { LoaderComponent } from '../../container';

@NgModule({
  declarations: [
  // Templates
    LoaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    LoaderComponent
  ],
  providers: [
    { provide: UrlSerializer, useClass: CustomUrl }
  ]
})
export class CoreModule { }
