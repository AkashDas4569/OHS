import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  DashboardComponent, 
  TestComponent
} from './';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'test',
    component: TestComponent,
    data: {
      title: 'Test'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
