import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _router: Router) { }

  _isAdmin:boolean

  ngOnInit(): void {
    // this._router.navigate(['retrieve-meeting-room-info']);
    if(localStorage.getItem('loggedIn') == "false")//
    {
      //this._router.navigate(['login']);
    }
    if(localStorage.getItem('admin') == "true")
    {
      this._isAdmin = true;
      console.log("Admin");
    }
    else
    {
      this._isAdmin = false;
      console.log("Not admin");
    }
   this.retrieveMeetings();
  }

  retrieveRooms():void
  {
    // this._router.navigate(['retrieve-meeting-room-info']);
    this._router.navigate(['dashboard/retrieve-meeting-room-info']);
  }
  retrieveEmps():void
  {
    this._router.navigate(['dashboard/employee-info']);
  }
  retrieveMeetings():void
  {
    this._router.navigate(['dashboard/meeting-info']);
  }
  logout():void
  {
    localStorage.setItem('loggedIn', "false");
    localStorage.setItem('admin',"false");
    console.log(localStorage.getItem('loggedIn'));
  }
}
