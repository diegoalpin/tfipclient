import { Injectable } from "@angular/core";
import { AppConstant } from "../constant";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Payment } from "../models/payment.model";

@Injectable()
export class StripeService{
    STRIPE_API = AppConstant.STRIPE_API_URL;
    constructor(private http:HttpClient){
    }

    payViaStripe(payment:Payment):Observable<any>{
        // const params = new HttpParams().set('maintId', 'maintId');
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
        
          return this.http.post<any>(this.STRIPE_API ,payment ,{headers:headers, withCredentials: true });

    }
}