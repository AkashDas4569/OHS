import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  SalesSummaryComponent, 
  AbnormalExamResultsComponent,
  AudiometricReportComponent,
  MedicalSurveillanceSummaryComponent
 } from './';

@NgModule({
  declarations: [
    SalesSummaryComponent, 
    AbnormalExamResultsComponent, 
    AudiometricReportComponent, 
    MedicalSurveillanceSummaryComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
