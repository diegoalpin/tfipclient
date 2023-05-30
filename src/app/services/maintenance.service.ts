import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstant } from "../constant";
import { Maintenance } from "../models/maintenance.model";
import { Observable } from "rxjs";

@Injectable()
export class MaintenanceService{
  
    MAINT_API = AppConstant.MAINT_API_URL;

    constructor(private http:HttpClient){}
    
    getMaintenancesByCarId(carId: number):Observable<Maintenance[]> {
        const params = new HttpParams().set('car_id', carId);

        const headers = new HttpHeaders().set(
          'Content-Type',
          'application/json; charset=utf-8'
        );
        return this.http.get<Maintenance[]>(this.MAINT_API , { params:params, headers:headers, withCredentials: true });
    }

    getMaintenanceById(maintId:number):Observable<Maintenance>{
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
          return this.http.get<Maintenance>(this.MAINT_API +'/'+maintId, { headers:headers, withCredentials: true });
    }

    getMaintenancesByEmail(email: string):Observable<Maintenance[]> {
        const params = new HttpParams().set('email', email);
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
          return this.http.get<Maintenance[]>(this.MAINT_API +'/all', {params:params, headers:headers, withCredentials: true });
      }

      getCarIdByMaintId(maintId: number):Observable<number> {
        const params = new HttpParams().set('maintId', maintId);
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
          return this.http.get<number>(this.MAINT_API +'/getCarId', {params:params, headers:headers, withCredentials: true });
      }
      
      createMaintenance(maint:Maintenance, carId:number):Observable<string>{
        const params = new HttpParams().set('car_id', carId);
        
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
        return this.http.post<string>(this.MAINT_API +'/',maint,{params:params, headers:headers, withCredentials: true})
      }
      updateMaintenance(maint:Maintenance):Observable<string>{
        
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
        return this.http.put<string>(this.MAINT_API +'/edit',maint,{headers:headers, withCredentials: true})
      }

      deleteMaintenance(maintId: number): Observable<string> {
        const headers = new HttpHeaders().set(
          'Content-Type',
          'application/json; charset=utf-8'
        );
        return this.http.delete<string>(this.MAINT_API+'/delete/'+maintId,{headers:headers, withCredentials: true} )
      }
    
}