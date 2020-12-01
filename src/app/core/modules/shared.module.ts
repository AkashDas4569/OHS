import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Material
import { MaterialModule } from './material.module';
// Ng-Select
import { NgSelectModule } from '@ng-select/ng-select';
// Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {
  ToggleViewPasswordDirective
} from '../directives';

import {
  FormatDatePipe,
  SearchFilterPipe
} from '../pipes';
import {
  MainLayoutComponent,
  // Templates
  SidebarComponent,
  HeaderComponent,
  CustomPopupComponent
} from '../../container';
// All Dialog Component
import {
  RegVisitpurposeComponent,
  UpdateuserComponent,
  DeleteUserComponent,
  DeleteOhdSettingsComponent
} from '../../container';
const allDialogTemplates = [
  RegVisitpurposeComponent,
  UpdateuserComponent,
  DeleteUserComponent,
  DeleteOhdSettingsComponent
]
@NgModule({
  declarations: [
    ToggleViewPasswordDirective,
    // Pipes
    FormatDatePipe,
    SearchFilterPipe,
    MainLayoutComponent,
    // All Dialog Component
    ...allDialogTemplates,
    // Templates
    SidebarComponent, 
    HeaderComponent,
    CustomPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Material
    MaterialModule,
    // Ng-Select
    NgSelectModule,
    // Bootstrap
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Material
    MaterialModule,
    // Ng-Select
    NgSelectModule,
    // Bootstrap
    BsDropdownModule,
    ModalModule,
    TooltipModule,
    BsDatepickerModule,
    TabsModule,
    CollapseModule,
    AccordionModule,
    // Directives
    ToggleViewPasswordDirective,
    // Pipes
    FormatDatePipe,
    SearchFilterPipe,
    MainLayoutComponent,
    // Templates
    SidebarComponent,
    HeaderComponent,
    CustomPopupComponent,
    // All Dialog Component
    ...allDialogTemplates
  ],
  providers: [
  ],
})
export class SharedModule { }
