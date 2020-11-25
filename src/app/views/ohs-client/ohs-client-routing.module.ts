import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  OhsClientListComponent, 
  OhsClientSettingsComponent  
} from './';


const routes: Routes = [
  {
    path: 'list',
    component: OhsClientListComponent,
    data: {
      title: 'OHS Client List'
    }
  },
  {
    path: 'settings',
    component: OhsClientSettingsComponent,
    data: {
      title: 'OHS Client Settings'
    }
  },
  {
    path: 'update-settings/:id',
    component: OhsClientSettingsComponent,
    data: {
      title: 'Update OHS Client Settings'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OhsClientRoutingModule { }
