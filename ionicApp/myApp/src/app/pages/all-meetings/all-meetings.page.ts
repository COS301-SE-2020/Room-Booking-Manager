import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../classes/meeting';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-all-meetings',
  templateUrl: './all-meetings.page.html',
  styleUrls: ['./all-meetings.page.scss'],
})
export class AllMeetingsPage implements OnInit {

  constructor(private _apiService: HttpService) { }

  ngOnInit() {
    this._apiService.getMeetings()
    .subscribe (
      data=>{
       //=data;//type casting into the  form listed in user.ts
       console.log('Response2', data);
       this.listMeetings=this.filter(data);
      });
  }
  listMeetings: Meeting[];
  
  
  
  filter(meetings){
    let name=localStorage.getItem('name');
    console.log("name: "+name);
    let bool;
    let filetered=[];
    console.log("length: "+meetings.length);
    for(let i=0;i<meetings.length;i++){
      
      bool=false;
      for(let u=0;u<meetings[i].Participants.length;u++)
      {
        if( meetings[i].Participants[u]==name){
          bool=true;
        }
      }
      
      if(bool){
        filetered.push(meetings[i]);
      }
    }
   
    return filetered;
  }
}
