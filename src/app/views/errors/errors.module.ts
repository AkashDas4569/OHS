import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
// import { SharedModule } from '../../core/modules/shared.module';

import { 
  NotFoundComponent, 
  UnauthorizedComponent 
} from './';

@NgModule({
  declarations: [NotFoundComponent, UnauthorizedComponent],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    // SharedModule
  ]
})
export class ErrorsModule { }
