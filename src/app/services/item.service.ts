import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom } from "rxjs";
import { AppConstant } from "../constant";
import { Item } from "../models/item.model";
import { ItemList } from "../models/itemlist.model";

@Injectable()
export class ItemService{
    
    ITEM_API = AppConstant.ITEM_API_URL;
    constructor(private http:HttpClient){}

    getItemsByMaintId(maintId:number):Observable<ItemList[]>{
        const params = new HttpParams().set('maintId', maintId);

        const headers = new HttpHeaders().set(
          'Content-Type',
          'application/json; charset=utf-8'
        );
        return this.http.get<ItemList[]>(this.ITEM_API +'/maintenance' , { params:params, headers:headers, withCredentials: true });
    }

    getAllItems(): Observable<Item[]> {
        const headers = new HttpHeaders().set(
            'Content-Type',
            'application/json; charset=utf-8'
          );
          return this.http.get<Item[]>(this.ITEM_API +'/all' , { headers:headers, withCredentials: true });
      }
    
}