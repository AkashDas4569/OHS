import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OhsClientRoutingModule } from './ohs-client-routing.module';
import { SharedModule } from '../../core/modules/shared.module';

import { 
  OhsClientListComponent, 
  OhsClientSettingsComponent  
} from './';


@NgModule({
  declarations: [OhsClientListComponent, OhsClientSettingsComponent],
  imports: [
    CommonModule,
    OhsClientRoutingModule,
    SharedModule
  ]
})
export class OhsClientModule { }
