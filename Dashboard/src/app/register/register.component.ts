import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { apiService } from '../services/api.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _apiService: apiService, private _router: Router,public dialogRef:MatDialogRef<RegisterComponent>) { }

  registerForm = new FormGroup({  
    userID: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),  
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    // submit: new FormControl()
  });
  get userID() {  
    return this.registerForm.get('userID');  
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
      
      if(this.users[i].Email == this.registerForm.get('email').value)
      {
        this._exist = true;
      }
    }

    if(!this._exist)
    {
      var formData=new User();
        // formData.EmployeeID=this.registerForm.get('userID').value;
        formData.FirstName=this.registerForm.get('firstname').value;
        formData.LastName=this.registerForm.get('lastname').value;
        formData.Email=this.registerForm.get('email').value;
        formData.EmpPassword=this.registerForm.get('password').value;
        

        // console.log(formData.userID + " - " + formData.firstName + " - " + formData.lastName + " - " + formData.email);
        this._apiService.registerUser(formData)
        .subscribe(
          data=>{
            console.log('Response post', data);
          }
        );
        // console.warn(this.RoomInfo.value)
        // console.log(this.RoomInfo.controls['RoomNumber'].value);//individual values
        //from here send json format to the DB 
        this._router.navigate(['dashboard']);
        this.cancel();
    }
    this.buttonReg ="clicked";
  }
  cancel(){
    this.dialogRef.close();
  }
}
