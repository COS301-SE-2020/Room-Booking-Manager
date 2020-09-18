import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllMeetingsPageRoutingModule } from './all-meetings-routing.module';

import { AllMeetingsPage } from './all-meetings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllMeetingsPageRoutingModule
  ],
  declarations: [AllMeetingsPage]
})
export class AllMeetingsPageModule {}
