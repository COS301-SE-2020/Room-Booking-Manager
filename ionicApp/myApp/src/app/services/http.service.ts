import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpclient: HttpClient) { }

  getUsers(): Observable<any>
    {
        
        let body={
            table:"EmployeeDetails",
            request:"view",
            data:""
        };
        return this.httpclient.post("http://localhost:65000/",body); 
    }
}
