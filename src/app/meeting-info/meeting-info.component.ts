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
    console.log("OnInitial");
    // if(this.listMeetings == undefined)
    // {
      this.apiDB.getMeetings()
    .subscribe (
      data=>{
       this.listMeetings=data;//type casting into the  form listed in user.ts
       console.log('Response2', data);
      }

    );
    // }
  }

  newList: Meeting[] = [];
  myMeetings()
  {
    console.log("myMeetings");
    var user = localStorage.getItem('username');
    // var user = "kg";
    console.log("Username =" + user);
    this.newList = [];
    this.listMeetings.forEach(element => {
      console.log(element.Organizer);
      var found = element.Organizer.includes(user)
      console.log(found);

      if(found)
      {
        this.newList.push(element);
        console.log(this.newList);
        
      }
      this.listMeetings = [];
      this.listMeetings = this.newList;
    });
  }

}
