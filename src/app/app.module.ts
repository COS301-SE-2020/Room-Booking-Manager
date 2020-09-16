import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';
import { apiService } from './services/api.service';
import { roomsService } from './services/rooms.service';
import { empService } from './services/employee.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Route } from '@angular/compiler/src/core';
import { LoginComponent } from './login/login.component';
import { RetrieveMeetingRoomInfoComponent } from './retrieve-meeting-room-info/retrieve-meeting-room-info.component';
import { AddMeetingRoomInfoComponent } from './add-meeting-room-info/add-meeting-room-info.component';
import { EditMeetingRoomInfoComponent } from './edit-meeting-room-info/edit-meeting-room-info.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RegisterComponent } from './register/register.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { MeetingInfoComponent } from './meeting-info/meeting-info.component';
import { RegisterConfirmComponent } from './register-confirm/register-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RetrieveMeetingRoomInfoComponent,
    AddMeetingRoomInfoComponent,
    EditMeetingRoomInfoComponent,
    RegisterComponent,
    EmployeeInfoComponent,
    EditEmployeeComponent,
    MeetingInfoComponent,
    RegisterConfirmComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    MaterialModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [apiService,roomsService,empService],
  bootstrap: [AppComponent],
  entryComponents:[AddMeetingRoomInfoComponent,EditMeetingRoomInfoComponent,RegisterComponent,EmployeeInfoComponent,EditEmployeeComponent]
})
export class AppModule { }
