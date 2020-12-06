import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import {
  MainLayoutComponent,
} from './container';
import { AuthGuard, NoAuthGuard } from './core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./views/auth/auth.module').then(mod => mod.AuthModule),
    canActivateChild: [NoAuthGuard]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'After Signin'
    },
  children: [
  {
    path: 'employee',
    loadChildren: () => import('./views/employee/employee.module').then(mod => mod.EmployeeModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'medical-surveillance',
    loadChildren: () => import('./views/medical-surveillance/medical-surveillance.module').then(mod => mod.MedicalSurveillanceModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'audiometric',
    loadChildren: () => import('./views/audiometric/audiometric.module').then(mod => mod.AudiometricModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'report',
    loadChildren: () => import('./views/report/report.module').then(mod => mod.ReportModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'ohs-client',
    loadChildren: () => import('./views/ohs-client/ohs-client.module').then(mod => mod.OhsClientModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'ohd-settings',
    loadChildren: () => import('./views/ohd/ohd.module').then(mod => mod.OhdModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./views/user/user.module').then(mod => mod.UserModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./views/errors/errors.module').then(mod => mod.ErrorsModule)
  },
  ]
},
   // Wild Card Routes
   {
    path: '**',
    redirectTo: '/not-found',
  },
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],

  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [200, 200],
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
