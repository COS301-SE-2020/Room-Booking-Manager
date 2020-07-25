import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RetrieveMeetingRoomInfoComponent } from './retrieve-meeting-room-info/retrieve-meeting-room-info.component'
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { MeetingInfoComponent } from './meeting-info/meeting-info.component';


const routes: Routes = 
[
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    children: [
      {path: 'employee-info', component: EmployeeInfoComponent},
      {path: 'retrieve-meeting-room-info', component: RetrieveMeetingRoomInfoComponent},
      {path: 'meeting-info', component: MeetingInfoComponent}
      
    ]
  }
  //,
  // {
  //   path:'retrieve-meeting-room-info',
  //   component:RetrieveMeetingRoomInfoComponent
  // }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
