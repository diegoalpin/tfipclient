import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { Observable } from "rxjs";
import { AppConstant } from "../constant";

@Injectable()
export class UserService{
    
    USER_API = AppConstant.CUSTOMER_API_URL;
    REGISTER_API=AppConstant.REGISTER_API_URL;
    constructor(private http:HttpClient){}

    getOtherCustomersExcept(userId:number):Observable<User[]>{
        const params = new HttpParams().set('custId', userId);

        const headers = new HttpHeaders().set(
          'Content-Type',
          'application/json; charset=utf-8'
        );
        return this.http.get<User[]>(this.USER_API +'/other',{params:params, headers:headers, withCredentials: true})
    }
    
    createUser(user: User):Observable<string> {
      const headers = new HttpHeaders().set(
        'Content-Type',
        'application/json; charset=utf-8'
      );
      return this.http.post<string>(this.REGISTER_API,user,{headers:headers, withCredentials: true})
    }
}