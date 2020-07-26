import { Component, OnInit } from '@angular/core';
import { apiService } from '../services/api.service';
import { Meeting } from '../classes/meeting';

@Component({
  selector: 'app-meeting-info',
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css']
})
export class MeetingInfoComponent implements OnInit {

  constructor(private apiDB: apiService) { }
  listMeetings: Meeting[];
  ngOnInit(): void {

    this.apiDB.getMeetings()
    .subscribe (
      data=>{
       this.listMeetings=data;//type casting into the  form listed in user.ts
       console.log('Response2', data);
      }

    );
  }

}
