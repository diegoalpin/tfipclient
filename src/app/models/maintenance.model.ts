import { Item } from "./item.model";
import { ItemList } from "./itemlist.model";

export interface Maintenance{
    id: number,
    description: string,
    date: Date,
    status: string,
    mileage: number,
    cost?: number,
    carId?:number,
    items:ItemList[]
}