import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { apiService } from '../services/api.service';
// import { roomsService } from '../services/rooms.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit {

  constructor(private _router: Router,private apiDB: apiService, private dialog:MatDialog, private renderer2:Renderer2) { }

  listEmployees:User[];
  ngOnInit(): void {
    // if(localStorage.getItem('loggedIn') == "true")//change to false
    // {
    //   this._router.navigate(['login']);
    // }
    // this.apiDB.getUsers()
    // .subscribe (
    //   data=>{
    //    this.listEmployees=data;//type casting into the  form listed in user.ts
    //    console.log('Response2', data);
    //   }

    // );
  }

}
