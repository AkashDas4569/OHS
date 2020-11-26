import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudiometricRoutingModule } from './audiometric-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  AudiometricTestComponent,
  OccupationalNoiseExposureComponent, 
  MedicalHistoryComponent, 
  AudiometryResultComponent 
} from './';
import { CheckoutComponent } from './checkout/checkout.component';



@NgModule({
  declarations: [
    AudiometricTestComponent, 
    OccupationalNoiseExposureComponent, 
    MedicalHistoryComponent, 
    AudiometryResultComponent, CheckoutComponent
  ],
  imports: [
    CommonModule,
    AudiometricRoutingModule,
    SharedModule
  ]
})
export class AudiometricModule { }
