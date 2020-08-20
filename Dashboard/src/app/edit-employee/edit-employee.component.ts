import { Component, OnInit,Inject } from '@angular/core';
import {FormGroup,FormControl, Validators} from '@angular/forms';
import { apiService } from '../services/api.service';
import { empService } from '../services/employee.service';
import {User} from '../classes/user';
//import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  constructor(private _router: Router,private apiDB: apiService,public dialogRef:MatDialogRef<EditEmployeeComponent>,private mUser:empService) { }
  get getUser():User
  {
    return this.mUser.myUser;
  }
  rad_admin: string[] = ['true', 'false'];
  
  EmpInfo=new FormGroup({
    firstname:new FormControl('',[Validators.required]),
    lastname:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required]),
    roomID:new FormControl('',[Validators.required]),
    password:new FormControl('',[Validators.required]),
    admin: new FormControl(',',[Validators.required])
  });

  get roomID() {  
    return this.EmpInfo.get('roomID');  
  } 
  get firstname() {  
    return this.EmpInfo.get('firstname');  
  } 
  get lastname() {  
    return this.EmpInfo.get('lastname');  
  } 
  get email() {  
    return this.EmpInfo.get('email');  
  } 
  get password() {  
    return this.EmpInfo.get('password');  
  } 
  get admin() {  
    return this.EmpInfo.get('admin');  
  } 

  adminChosen: string
  ngOnInit(): void {

    if(localStorage.getItem('loggedIn') == "false")
    {
      //this._router.navigate(['login']);
    }
    this.adminChosen = <string><any>this.getUser.isAdmin;
    this.EmpInfo.controls['firstname'].setValue(this.getUser.FirstName);
    this.EmpInfo.controls['lastname'].setValue(this.getUser.LastName);
    this.EmpInfo.controls['email'].setValue(this.getUser.EmpEmail);
    this.EmpInfo.controls['roomID'].setValue(this.getUser.LocationID);
    this.EmpInfo.controls['password'].setValue(this.getUser.EmpPassword);
    this.EmpInfo.controls['admin'].setValue(this.adminChosen);
    
    console.log(this.adminChosen);
  }
  updateE(){
    var formData=new User();
    formData.FirstName = <string><any>this.EmpInfo.controls['firstname'].value;
    formData.LastName = <string><any>this.EmpInfo.controls['lastname'].value;
    formData.EmpEmail = <string><any>this.EmpInfo.controls['email'].value;
    formData.LocationID = <string><any>this.EmpInfo.controls['roomID'].value;
    formData.EmpPassword = <string><any>this.EmpInfo.controls['password'].value;
    formData.isAdmin = <boolean><any>this.EmpInfo.controls['admin'].value;
    console.log(formData);
    this.apiDB.updateEmployee(formData)
    .subscribe(
      data=>{
        console.log('Response post', data);
      }
    );
    this.cancel();
    this.done();

  }
  onClose(){
    this.dialogRef.close();
    //window.location.reload();
  }
  cancel(){
    this.onClose();
  }
  done(){
    //window.location.reload();
  }
}
