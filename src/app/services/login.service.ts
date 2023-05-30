import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { AppConstant } from "../constant";

@Injectable({
    providedIn: 'root'
  })
  export class LoginService {
  
    constructor(private http: HttpClient) {
      
    }
  
    validateLoginDetails(user: User) {
      window.sessionStorage.setItem("userdetails",JSON.stringify(user));
      return this.http.get(AppConstant.LOGIN_API_URL, { observe: 'response',withCredentials: true });
    }
  
  }