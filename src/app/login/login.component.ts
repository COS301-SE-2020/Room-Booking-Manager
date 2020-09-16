import { RegisterComponent } from './../register/register.component';
import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { apiService } from '../services/api.service';
import { Comments } from '../classes/comments';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  
  constructor(private _apiService: apiService, private _router: Router,private dialog:MatDialog){}
  form = new FormGroup({  
    username: new FormControl('', Validators.required),  
    password: new FormControl('', Validators.required),
    // submit: new FormControl()
  });

  register(){
    const configDialog=new MatDialogConfig();
    configDialog.backdropClass="backGround";
    // configDialog.width='700px';
    // configDialog.height='400px';
    this.dialog.open(RegisterComponent ,configDialog);
  }
  get username() {  
    return this.form.get('username');  
  } 
  get password() {  
    return this.form.get('password');  
  } 

  registerForm = new FormGroup({  
    userID: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),  
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    officeID: new FormControl('', Validators.required),
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
  get officeID() {  
    return this.registerForm.get('officeID');  
  } 
  
  //lstcomments:Comments[];
  users:User[];
  myForm = "login";
  tab:string;
  ngOnInit()
  {
    //this._router.navigate(['dashboard']);
    this.tab = "Register";
    this.myForm = "login";
    // this._apiService.getcomments()
    // .subscribe
    // (
    //   data=>
    //   {
    //       this.lstcomments = data;//typecast data to list of comments 
    //       console.log(this.lstcomments);
    //   }
    // )

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
  
  switch()
  {
    if(this.myForm == "login")
    {
      this.myForm = "register";
      this.tab = "Login";
    }
    else if(this.myForm == "register")
    {
      this.myForm = "login";
      this.tab = "Register";
    }
  }
  _username:string;
  _password:string;
  _match:boolean;
  _exist = false;
  _admin:string
  buttonLogin = "";
  buttonReg = "";

  onSubmit() 
  {
    // TODO: Use EventEmitter with form value
    console.warn(this.form.get('username').value);
    console.warn(this.form.value);
    this._username = this.form.get('username').value;
    this._password = this.form.get('password').value;

    for(let i = 0; i < this.users.length; i++) 
    {
      
      if(this.users[i].EmpEmail == this._username)
      {
        console.log("Found");
        if(this.users[i].EmpPassword == this._password)
        {
          console.log("Passwords match");
          this._match = true;
          localStorage.setItem('loggedIn', "true");
          localStorage.setItem('username',this.users[i].FirstName + " " + this.users[i].LastName);
          if(this.users[i].isAdmin)
          {
            this._admin = "true";
          }
          else
          {
            this._admin = "false";
          }
          //this._admin = <string><any>this.users[i].isAdmin;
          localStorage.setItem('admin',this._admin)
          console.log(localStorage.getItem('admin'));
          this._router.navigate(['dashboard']);
        }
        else
        {
          console.log("Wrong password!");
          this._match = false;
          this.password.reset();
          //this._router.navigate([`dashboard`]);
        }
      }
    }
    this.buttonLogin = "clicked";
  }

  // onRegister()
  // {
    
   
  //   for(let i = 0; i < this.users.length; i++) 
  //   {
      
  //     if(this.users[i].userID == this.registerForm.get('userID').value)
  //     {
  //       this._exist = true;
  //     }
  //   }

  //   if(!this._exist)
  //   {
  //     var formData=new User();
  //       formData.userID=this.registerForm.get('userID').value;
  //       formData.FirstName=this.registerForm.get('firstname').value;
  //       formData.LastName=this.registerForm.get('lastname').value;
  //       formData.Email=this.registerForm.get('email').value;
  //       formData.officeRoomID=this.registerForm.get('officeID').value;
        

  //       this._apiService.registerUser(formData)
  //       .subscribe(
  //         data=>{
  //           console.log('Response post', data);
  //         }
  //       );
         
  //       this._router.navigate(['dashboard']);
  //   }
  //   this.buttonReg ="clicked";
  // }

}
