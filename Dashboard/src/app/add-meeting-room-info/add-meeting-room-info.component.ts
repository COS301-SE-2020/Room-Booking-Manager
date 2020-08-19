import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { apiService } from '../services/api.service';
import {Room} from '../classes/room';
//import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { concat } from 'rxjs';

@Component({
  selector: 'app-add-meeting-room-info',
  templateUrl: './add-meeting-room-info.component.html',
  styleUrls: ['./add-meeting-room-info.component.css']
})
export class AddMeetingRoomInfoComponent implements OnInit {

  //constructor(private apiDB: apiService,public dialogRef:MatDialogRef<AddMeetingRoomInfoComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
  constructor(private _router: Router,private apiDB: apiService,public dialogRef:MatDialogRef<AddMeetingRoomInfoComponent>) { }
  
  amenityList: string[] = ['Projector', 'Whiteboard', 'Monitor', 'Polycom Telephone'];
  floorNumbers: string[] = ['1','2','3','4'];
  buildingList: string[] = ['A','B','C','D'];
  RoomInfo=new FormGroup({
    RoomNumber:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
    FloorNumber:new FormControl(''),
    Amenity:new FormControl(''),
    NrSeats:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
    RoomName:new FormControl('',[Validators.required]),
    Building:new FormControl(''),
    Distance:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")])
  });
  ngOnInit(): void {
    if(localStorage.getItem('loggedIn') == "false")
    {
      // this._router.navigate(['login']);
    }
  }

  onSubmit(){
    console.log("no seats",this.RoomInfo.controls['Amenity'].value);
    var formData=new Room();
    
    var roomNumber =<string><any>this.RoomInfo.controls['RoomNumber'].value;
    formData.Amenity=<string><any>this.RoomInfo.controls['Amenity'].value;
    formData.FloorNumber=<number><any>this.RoomInfo.controls['FloorNumber'].value;
    formData.RoomName=<string><any>this.RoomInfo.controls['RoomName'].value;
    formData.maxSeats=<number><any>this.RoomInfo.controls['NrSeats'].value;
    formData.Building = <number><any>this.RoomInfo.controls['Building'].value;
    
    // formData.isAvailable = true;
    formData.isExternal = false;
    var rID = (<string><any>formData.FloorNumber).concat(<string><any>formData.Building);
    rID = rID.concat(roomNumber);
    formData.RoomID = rID;
    var dist = <number><any>this.RoomInfo.controls['Distance'].value;
    console.log("Room ID- " + rID + "; distance from elevator- " + dist);
    if(formData.Amenity.includes("Whiteboard"))
    {
      formData.Whiteboard = true;
    }
    else
    {
      formData.Whiteboard = false;
    }
    if(formData.Amenity.includes("Projector"))
    {
      formData.Projector = true;
    }
    else
    {
      formData.Projector = false;
    }
    if(formData.Amenity.includes("Monitor"))
    {
      formData.Monitor = true;
    }
    else
    {
      formData.Monitor = false;
    }

    console.log(formData);
    this.apiDB.post(formData)
    .subscribe(
      data=>{
        console.log('Response post', data);
      }
    );
    // console.warn(this.RoomInfo.value)
    // console.log(this.RoomInfo.controls['RoomNumber'].value);//individual values
    //from here send json format to the DB 
    this.onClose();
    this.done();
  }
  onClose(){
    this.dialogRef.close();
  }
  cancel(){
    this.onClose();
  }
  done(){
    // window.location.reload();
  }

}
