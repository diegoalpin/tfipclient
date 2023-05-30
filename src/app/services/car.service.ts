import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../models/car.model';
import { AppConstant } from '../constant';

@Injectable()
export class CarService {
  
  CAR_API = AppConstant.CAR_API_URL;

  constructor(private http: HttpClient) {}

  public getAllCars(email: string): Observable<Car[]> {
    const params = new HttpParams().set('email', email);

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.get<Car[]>(this.CAR_API + '/all', { params:params, headers:headers, withCredentials: true });
  }

  public getCarById(carId:number):Observable<Car>{
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    return this.http.get<Car>(this.CAR_API + '/'+carId, { headers:headers, withCredentials: true });
  }
  public putCarOnSale(carId:number,buyerId:number):Observable<string>{
    const params = new HttpParams().set('carId', carId)
                                    .set('buyerId',buyerId);
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
   return this.http.post<string>(this.CAR_API+'/sale',{params:params,headers:headers, withCredentials: true})
  }
  public getCarsSoldTo(buyerId:number):Observable<Car[]>{
    const params = new HttpParams().set('buyerId',buyerId);

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.get<Car[]>(this.CAR_API+'/soldto',{params:params,headers:headers, withCredentials: true})
  }
  public getCarsSoldBy(sellerId:number):Observable<Car[]>{
    const params = new HttpParams().set('sellerId',sellerId);

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.get<Car[]>(this.CAR_API+'/soldfrom',{params:params,headers:headers, withCredentials: true})
  }

  public transferCarOwner(carPlate: string):Observable<string> {
    const params = new HttpParams().set('carPlate',carPlate);

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http.post<string>(this.CAR_API+'/transfer',{params:params,headers:headers, withCredentials: true})
  }
}
