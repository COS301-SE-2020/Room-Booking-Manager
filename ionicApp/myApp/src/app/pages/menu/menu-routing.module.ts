import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children:[
      {
        path: 'today-meetings',
        loadChildren: () => import('../today-meetings/today-meetings.module').then( m => m.TodayMeetingsPageModule)
      },
      {
        path: 'all-meetings',
        loadChildren: () => import('../all-meetings/all-meetings.module').then( m => m.AllMeetingsPageModule)
      }  
    ]
  },
  // {
  //   path: 'today-meetings',
  //   loadChildren: () => import('../today-meetings/today-meetings.module').then( m => m.TodayMeetingsPageModule)
  // } ,
  // {
  //   path: 'all-meetings',
  //   loadChildren: () => import('../all-meetings/all-meetings.module').then( m => m.AllMeetingsPageModule)
  // }  ,
  {
    path: '',
    redirectTo: '/menu/today-meetings'
  },
  {
    path: 'login',
    loadChildren: () => import('../../login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
