import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<RegisterConfirmComponent>) { }

  ngOnInit(): void {
  }
  submit()
  {
    this.dialogRef.close();
  }

}
