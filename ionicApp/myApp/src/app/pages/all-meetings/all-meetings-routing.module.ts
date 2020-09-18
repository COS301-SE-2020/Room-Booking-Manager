import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllMeetingsPage } from './all-meetings.page';

const routes: Routes = [
  {
    path: '',
    component: AllMeetingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllMeetingsPageRoutingModule {}
