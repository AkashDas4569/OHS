import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportResultRoutingModule } from './report-result-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  MedicalSurveillanceReportResultComponent,
  AudiometricReportResultComponent,
  FitnessCertificateResultComponent,
  SummaryReportMedicalSurveillanceComponent,
  MedicalRemovalProtectionComponent,
  MedicalRecordBookResultComponent
} from './';


@NgModule({
  declarations: [
    MedicalSurveillanceReportResultComponent,
    AudiometricReportResultComponent,
    FitnessCertificateResultComponent,
    SummaryReportMedicalSurveillanceComponent,
    MedicalRemovalProtectionComponent,
    MedicalRecordBookResultComponent
  ],
  imports: [
    CommonModule,
    ReportResultRoutingModule,
    SharedModule
  ]
})
export class ReportResultModule { }
