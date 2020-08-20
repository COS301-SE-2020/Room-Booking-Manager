import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { apiService } from '../services/api.service';
import { roomsService } from '../services/rooms.service';
import {Room} from '../classes/room';
import { AddMeetingRoomInfoComponent } from '../add-meeting-room-info/add-meeting-room-info.component';
import { EditMeetingRoomInfoComponent } from '../edit-meeting-room-info/edit-meeting-room-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retrieve-meeting-room-info',
  templateUrl: './retrieve-meeting-room-info.component.html',
  styleUrls: ['./retrieve-meeting-room-info.component.css']
})
export class RetrieveMeetingRoomInfoComponent implements OnInit,AfterViewInit {
  @ViewChild('data') data;
  constructor(private _router: Router,private apiDB: apiService, private dialog:MatDialog, private renderer2:Renderer2, private mRoom:roomsService) { }
  //constructor(private apiDB: apiService, private renderer2:Renderer2) { }
  
  get getRoom():Room
  {
    return this.mRoom.myRoom;
  }
  set setRoom(_room:Room)
  {
    this.mRoom.myRoom = _room;
  }
  listComments:Room[];
  ngOnInit(): void {
    if(localStorage.getItem('loggedIn') == "false")
    {
      //this._router.navigate(['login']);
    }
    this.apiDB.getRooms()
    .subscribe (
      data=>{
       this.listComments=data;//type casting into the  form listed in comments.ts
       console.log('Response2', data);
      }

    );
  }
  ngAfterViewInit(){
    console.log(this.data.nativeElement);
    //this.renderer2.appendChild(this.data.nativeElement,this.renderer2.createText("testing"));
  }
  edit(id:string,floorNum:number,amenities:string,numParticipants:number,roomName:string,is_External:boolean,Building:number,Whiteboard:boolean,Projector:boolean,Monitor:boolean,is_Available:boolean)
  {
    var formData=new Room();
    formData.RoomID = id;
    formData.FloorNumber = floorNum;
    formData.Amenity = amenities;
    formData.maxSeats = numParticipants;
    formData.RoomName = roomName;
    formData.isExternal = is_External;
    formData.Building = Building;
    formData.Whiteboard = Whiteboard;
    formData.Projector = Projector;
    formData.Monitor = Monitor;
    // formData.isAvailable = is_Available;
    console.log(formData);
    this.setRoom = formData;
    // this.apiDB.getRecord(formData)
    // .subscribe(
    //   data=>{
    //     console.log('Response post', data);
    //   });
        //window.location.reload();
        //this.ngOnInit();
    const editDialog=new MatDialogConfig();
    editDialog.backdropClass="backGround";
    // configDialog.width='700px';
    // configDialog.height='400px';
    this.dialog.open(EditMeetingRoomInfoComponent,editDialog);
  }
  delete(id:string){
    if(confirm(`Are you sure to delete Room number ${id}`)) {
      console.log("Implement delete functionality here");
      var formData=new Room();
      formData.RoomID=id;
      this.apiDB.delete(formData)
      .subscribe(
        data=>{
          console.log('Response post', data);
        });
        //window.location.reload();
        this.ngOnInit();
    }
  }

  onCreate(){
    const configDialog=new MatDialogConfig();
    configDialog.backdropClass="backGround";
    // configDialog.width='700px';
    // configDialog.height='400px';
    this.dialog.open(AddMeetingRoomInfoComponent,configDialog);
    // window.location.reload();
    this.ngOnInit();
  }
}
