import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  NotFoundComponent,
  UnauthorizedComponent
} from './';

const routes: Routes = [
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: {
      title: 'Not Found'
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: {
      title: 'Unauthorized'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
