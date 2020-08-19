import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { apiService } from '../services/api.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { MatDialog,MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { RegisterConfirmComponent } from '../register-confirm/register-confirm.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _apiService: apiService, private _router: Router,private dialog:MatDialog,public dialogRef:MatDialogRef<RegisterComponent>) { }

  floorNumbers: string[] = ['1','2','3','4'];
  buildingList: string[] = ['A','B','C','D'];
  registerForm = new FormGroup({  
    roomNum: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),  
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    floorNumber:new FormControl(''),
    building:new FormControl(''),
    distance: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")])
    // submit: new FormControl()
  });
  get roomID() {  
    return this.registerForm.get('roomID');  
  } 
  get firstname() {  
    return this.registerForm.get('firstname');  
  } 
  get lastname() {  
    return this.registerForm.get('lastname');  
  } 
  get email() {  
    return this.registerForm.get('email');  
  } 
  get password() {  
    return this.registerForm.get('password');  
  } 

  users:User[];

  ngOnInit(): void {
    console.log("getting users");
    this._apiService.getUsers()
    .subscribe
    (
      data=>
      {
          this.users = data;//typecast data to list of comments 
          
          console.log(this.users);
      }
    )
  }

  buttonReg = "";
  _exist = false;
  onRegister()
  {
    
    //check if user already exists
    for(let i = 0; i < this.users.length; i++) 
    {
      
      if(this.users[i].EmpEmail == this.registerForm.get('email').value)
      {
        this._exist = true;
      }
    }

    if(!this._exist)
    {
      var formData=new User();
        // 
        formData.FirstName=this.registerForm.get('firstname').value;
        formData.LastName=this.registerForm.get('lastname').value;
        formData.EmpEmail=this.registerForm.get('email').value;
        formData.EmpPassword=this.registerForm.get('password').value;
        
        formData.isAdmin = false;
        var rID = (<string><any>this.registerForm.get('floorNumber').value).concat(<string><any>this.registerForm.get('building').value);
        rID = rID.concat(<string><any>this.registerForm.get('roomNum').value);
        var dist = <string><any>this.registerForm.get('distance').value
        formData.LocationID= rID;
        console.log(rID + "--" + dist);

        // console.log(formData.userID + " - " + formData.firstName + " - " + formData.lastName + " - " + formData.email);
        this._apiService.registerUser(formData)
        .subscribe(
          data=>{
            console.log('Response post', data);
            this.done();
          }
        );
        //console.warn(this.RoomInfo.value)
        //console.log(this.RoomInfo.controls['RoomNumber'].value);//individual values
        //from here send json format to the DB
        this.cancel();
    }
    this.buttonReg ="clicked";
  }
  cancel(){
    this.dialogRef.close();
  }
  done()
  {
    this.dialogRef.close();
    const editDialog=new MatDialogConfig();
    editDialog.backdropClass="backGround";
    this.dialog.open(RegisterConfirmComponent,editDialog);
  }
}
