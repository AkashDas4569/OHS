import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  SalesSummaryComponent, 
  AbnormalExamResultsComponent,
  AudiometricReportComponent,
  MedicalSurveillanceSummaryComponent
 } from './';

const routes: Routes = [
  {
    path: 'sales-summary',
    component: SalesSummaryComponent,
    data: {
      title: 'Sales Summary'
    }
  },
  {
    path: 'abnormal-exam-results',
    component: AbnormalExamResultsComponent,
    data: {
      title: 'Abnormal Exam. Results'
    }
  },
  {
    path: 'audiometric-report',
    component: AudiometricReportComponent,
    data: {
      title: 'Audiometric Report'
    }
  },
  {
    path: 'medical-surveillance-summary',
    component: MedicalSurveillanceSummaryComponent,
    data: {
      title: 'Medical Surveillance Summary'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
