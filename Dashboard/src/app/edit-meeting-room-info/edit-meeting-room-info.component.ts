import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup,FormControl, Validators} from '@angular/forms';
import { apiService } from '../services/api.service';
import { roomsService } from '../services/rooms.service';
import {Room} from '../classes/room';
//import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-meeting-room-info',
  templateUrl: './edit-meeting-room-info.component.html',
  styleUrls: ['./edit-meeting-room-info.component.css']
})
export class EditMeetingRoomInfoComponent implements OnInit {

  constructor(private _router: Router,private apiDB: apiService,public dialogRef:MatDialogRef<EditMeetingRoomInfoComponent>,private mRoom:roomsService) { }
  get getRoom():Room
  {
    return this.mRoom.myRoom;
  }
  amenityList: string[] = ['Projector', 'Whiteboard', 'Monitor', 'Polycom Telephone'];
  RoomInfo=new FormGroup({
    RoomNumber:new FormControl('',[Validators.required]),
    FloorNumber:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
    Amenity:new FormControl(''),
    NrSeats:new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
    RoomName:new FormControl('',[Validators.required])
  });
  get RoomNumber() {  
    return this.RoomInfo.get('RoomInfo');  
  } 
  amenities:string[];
  //am:any =[];
  ngOnInit(): void {
    if(localStorage.getItem('loggedIn') == "false")
    {
      //this._router.navigate(['login']);
    }
    console.log("here");
    console.log(this.getRoom.RoomName);
    this.amenities = this.getRoom.Amenity.split(',');
    // console.log(this.amenities);
    // for(let i = 0; i < this.amenities.length; i++) 
    // {
      
    //   this.am.push({name:this.amenities[i]});
    // }
   // console.log('final-> '+ this.am[name]);
    this.RoomInfo.controls['RoomNumber'].setValue(this.getRoom.RoomID);
    this.RoomInfo.controls['FloorNumber'].setValue(this.getRoom.FloorNumber);
    this.RoomInfo.controls['Amenity'].setValue(this.getRoom.Amenity);
    this.RoomInfo.controls['NrSeats'].setValue(this.getRoom.maxSeats);
    this.RoomInfo.controls['RoomName'].setValue(this.getRoom.RoomName);
    //console.log(this.getRoom.Amenities + " - " + this.RoomInfo.controls['RoomNumber'].value);
  }
  
  updateR(){
    var formData=new Room();
    formData.RoomID=<string><any>this.RoomInfo.controls['RoomNumber'].value;
    formData.Amenity=<string><any>this.RoomInfo.controls['Amenity'].value;
    formData.FloorNumber=<number><any>this.RoomInfo.controls['FloorNumber'].value;
    formData.RoomName=<string><any>this.RoomInfo.controls['RoomName'].value;
    formData.maxSeats=<number><any>this.RoomInfo.controls['NrSeats'].value;
    formData.isExternal = this.getRoom.isExternal;
    formData.Building = this.getRoom.Building;
    formData.Whiteboard = this.getRoom.Whiteboard;
    formData.Projector = this.getRoom.Projector;
    formData.Monitor = this.getRoom.Monitor;
    // formData.isAvailable = this.getRoom.isAvailable;
    console.log(formData);
    this.apiDB.updateRoom(formData)
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
