import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  OhdSettingsComponent, 
  ManageUsersComponent,
  ChangePasswordComponent 
} from './';

const routes: Routes = [
  {
    path: 'settings',
    component: OhdSettingsComponent,
    data: {
      title: 'OHD Settings'
    }
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    data: {
      title: 'Manage Users'
    }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password'
    }
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OhdRoutingModule { }
