import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodayMeetingsPage } from './today-meetings.page';

const routes: Routes = [
  {
    path: '',
    component: TodayMeetingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodayMeetingsPageRoutingModule {}
