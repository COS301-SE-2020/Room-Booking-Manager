import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { apiService } from '../services/api.service';
import { empService } from '../services/employee.service';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { User } from '../classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit {
  @ViewChild('data') data;
  constructor(private _router: Router,private apiDB: apiService, private dialog:MatDialog, private renderer2:Renderer2, private mUser:empService) { }
 
  set setEmp(_user:User)
  {
    this.mUser.myUser = _user;
  }
  listEmployees:User[];
  ngOnInit(): void {
    if(localStorage.getItem('loggedIn') == "false")
    {
      //this._router.navigate(['login']);
    }
    this.apiDB.getUsers()
    .subscribe (
      data=>{
       this.listEmployees=data;//type casting into the  form listed in user.ts
       console.log('Response2', data);
      }

    );
  }

  edit(fName:string,lName:string,email:string,location:string,password:string,isAdmin:boolean)
  {
    var formData=new User();
    formData.FirstName = fName;
    formData.LastName = lName;
    formData.EmpEmail = email;
    formData.LocationID = location;
    formData.EmpPassword = password;
    formData.isAdmin = isAdmin;
    this.setEmp = formData;
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
    this.dialog.open(EditEmployeeComponent,editDialog);
  }
  delete(id:string){
    if(confirm(`Are you sure to delete Room number ${id}`)) {
      console.log("Implement delete functionality here");
      var formData=new User();
      formData.EmpEmail=id;
      this.apiDB.deleteUser(formData)
      .subscribe(
        data=>{
          console.log('Response post', data);
        });
        // window.location.reload();
        //this.ngOnInit();
    }
    this.done();
  }
  done(){
    window.location.reload();
  }

}
