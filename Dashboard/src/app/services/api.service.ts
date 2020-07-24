import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {Room} from '../classes/room';
import { User } from '../classes/user';

@Injectable()
export class apiService
{
    constructor(private httpclient: HttpClient){}
    getcomments(): Observable<any>
    {
        let body={
            table:"Admins",
            request:"view",
            data:""
        };
        return this.httpclient.post("http://localhost:65000/",body); 
    }
    getUsers(): Observable<any>
    {
        let body={
            table:"EmployeeDetails",
            request:"view",
            data:""
        };
        return this.httpclient.post("http://localhost:65000/",body); 
    }
    getRooms(): Observable<any>
    {
        let body={
            table:"FloorPlan",
            request:"view",
            data:""
        };
        return this.httpclient.post("http://localhost:65000/",body); 
    }

    post(postedData:Room):Observable<any>
    {
       let obj={
            table:"FloorPlan",
            request:"create",
            data:postedData
        };
        console.log("posted data ",obj);
        return this.httpclient.post("http://localhost:65000/",obj);
    }
    registerUser(postedData:User):Observable<any>
    {
       let obj={
            table:"EmployeeDetails",
            request:"create",
            data:postedData
        };
        console.log("posted data ",obj);
        return this.httpclient.post("http://localhost:65000/",obj);
    }

    getRecord(postedData:Room):Observable<any>{

        let obj={
            table:"FloorPlan",
            request:"read",
            data:postedData
        };
        return this.httpclient.post("http://localhost:65000/",obj);
    }
    delete(postedData:Room):Observable<any>{

        let obj={
            table:"FloorPlan",
            request:"delete",
            data:postedData
        };
        return this.httpclient.post("http://localhost:65000/",obj);
    }

    updateRoom(postedData:Room):Observable<any>{
        
        let obj={
            table:"FloorPlan",
            request:"update",
            data:postedData
        };
        return this.httpclient.post("http://localhost:65000/",obj);
    }
}