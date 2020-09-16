import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {

  constructor(private _router: Router,public dialogRef:MatDialogRef<RegisterConfirmComponent>) { }

  ngOnInit(): void {
  }
  submit()
  {
    this._router.navigate(['login']);
  }

}
