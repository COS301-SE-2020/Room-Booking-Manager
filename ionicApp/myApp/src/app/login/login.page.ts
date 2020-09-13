import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { User } from '../classes/user';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private _apiService: HttpService, private _router: Router) { }
  users:User[];
  ngOnInit() {
  }

  form = new FormGroup({  
    username: new FormControl('', [Validators.required, Validators.email,]),  
    password: new FormControl('', Validators.required)
  });

  _username:string;
  _password:string;
  _match:boolean;
  _exist = false;
  _admin:string
  buttonLogin = "";
  buttonReg = "";
  
  get password() {  
    return this.form.get('password');  
  } 

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

}
