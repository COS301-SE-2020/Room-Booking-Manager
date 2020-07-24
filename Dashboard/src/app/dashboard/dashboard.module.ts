import { MaterialModule } from '../material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';
import { apiService } from '../services/api.service';

import { LoginComponent } from '../login/login.component';
import { RetrieveMeetingRoomInfoComponent } from '../retrieve-meeting-room-info/retrieve-meeting-room-info.component';
import { EmployeeInfoComponent } from '../employee-info/employee-info.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    RetrieveMeetingRoomInfoComponent,
    EmployeeInfoComponent
  ],
  imports: [
    BrowserModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MaterialModule,
    HttpClientModule,
    NgMultiSelectDropDownModule
  ],
  providers: [apiService],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
