import { Router, RouterEvent } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  //options that can be selected in menu
  
  selectedPath='';
  constructor(private router:Router) {
    //to indicate selected item we also add css
    this.router.events.subscribe((event:RouterEvent)=>{
      this.selectedPath=event.url;
    });
   }
  //  e(){
  //   this._router.navigate(['menu']);

  //  }

  ngOnInit() {
  }

}
