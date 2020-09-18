import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayMeetingsPageRoutingModule } from './today-meetings-routing.module';

import { TodayMeetingsPage } from './today-meetings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayMeetingsPageRoutingModule
  ],
  declarations: [TodayMeetingsPage]
})
export class TodayMeetingsPageModule {}
