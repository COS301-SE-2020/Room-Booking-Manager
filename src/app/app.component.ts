import { Component } from '@angular/core';
// import {FormGroup,FormControl,Validators} from '@angular/forms';
// import { apiService } from './services/api.service';
// import { Comments } from './classes/comments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Room Booking Manager';
  constructor(private _router: Router){}
  ngOnInit()
  {
    localStorage.setItem('loggedIn', "false");
    console.log("loca" + localStorage.getItem('loggedIn'));
  }
  // constructor(private _apiService: apiService, private _router: Router){}
  // form = new FormGroup({  
  //   username: new FormControl('', Validators.required),  
  //   password: new FormControl('', Validators.required),
  //   // submit: new FormControl()
  // });
  // get username() {  
  //   return this.form.get('username');  
  // } 
  // get password() {  
  //   return this.form.get('password');  
  // } 
  
  // lstcomments:Comments[];
  // ngOnInit()
  // {
  //   this._apiService.getcomments()
  //   .subscribe
  //   (
  //     data=>
  //     {
  //         this.lstcomments = data;//typecast data to list of comments 
  //         console.log(this.lstcomments);
  //     }
  //   )
  //   this._router.navigate(['dashboard']);
  // }
  // _username:string;
  // _password:string;
  // _match:boolean;
  // button = "";

  // onSubmit() {
  //   // TODO: Use EventEmitter with form value
  //   console.warn(this.form.get('username').value);
  //   console.warn(this.form.value);
  //   this._username = this.form.get('username').value;
  //   this._password = this.form.get('password').value;

  //   for(let i = 0; i < this.lstcomments.length; i++) 
  //   {
      
  //     if(this.lstcomments[i].Username == this._username)
  //     {
  //       console.log("Found");
  //       if(this.lstcomments[i].Password == this._password)
  //       {
  //         console.log("Passwords match");
  //         this._match = true;
  //         this._router.navigate(['dashboard']);
  //       }
  //       else
  //       {
  //         console.log("Wrong password!");
  //         this._match = false;
  //         //this._router.navigate([`dashboard`]);
  //       }
  //     }
  //   }
  //   this.button = "clicked";
  // }
}
