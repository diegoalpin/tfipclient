import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Car } from 'src/app/models/car.model';
import * as $ from 'jquery';
import { User } from 'src/app/models/user.model';
import { CarService } from 'src/app/services/car.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// declare var $ : any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      return [
        { title: 'Card 1', cols: 1, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 1 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
  cars: Car[]=[];
  user = new User();
  subs!: Subscription;
  otherCustomers: User[]=[]
  sellToCustomer = new User()
  soldIds:number[]=[]

  constructor(private breakpointObserver: BreakpointObserver,
              private carSvc: CarService,private loadingSvc:LoadingService,
              private router:Router, private userSvc:UserService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  async ngOnInit(): Promise<void> {
    if(sessionStorage.getItem('userdetails')){
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }
    console.log(this.user);

    const cars$ = this.carSvc.getAllCars(this.user.email);
    const loadCars$ = this.loadingSvc.showLoaderUntilCompleted(cars$);

    this.subs = loadCars$.subscribe(response=>{
      
      setTimeout(() => {
        
      }, 1000);
      this.cars = response;
    });
    //DONT FORGET check if any of the care is on sale
    await firstValueFrom(this.carSvc.getCarsSoldBy(this.user.id)).then(result=>{
      this.soldIds = result.map(car=>car.id)
      console.log("sold ids are",this.soldIds)
    }).catch(error=>{
      console.log(error);
    })

    await firstValueFrom(this.userSvc.getOtherCustomersExcept(this.user.id)).then(response=>{
      this.otherCustomers = response;
      console.log("other customers are", response);
    })

    // this.subs = this.carSvc.getAllCars(this.user.email).subscribe(response=>{
    //   this.cars = response;
    // })
    // this.cars = [
    //   {id:1,carPlate:"S123456",brand:"Toyota",model:"Vios",yearManufactured: 1998},
    //   {id:6,carPlate:"S324258",brand:"Honda",model:"CRV",yearManufactured: 2016},
    //   {id:7,carPlate:"S124650",brand:"Mercedes",model:"A-Class",yearManufactured: 2001},
    //   {id:8,carPlate:"S125653",brand:"Audi",model:"V8",yearManufactured: 2022}
    // ]; 
  }

  addCar(){
    this.router.navigate(['/maintenance','add'],{ queryParams: { carId: 1 }});
  }
  
  setSellTo(selected:any){
    const userId:number = selected.target.value
    console.log(userId)
    const user = this.otherCustomers.filter(v=>v.id==userId).at(0);
    if(user!=undefined){
      this.sellToCustomer = user
    }
  }

  async transfer(carPlate: string, carId:number){
    const fullname = this.sellToCustomer.firstName+" "+this.sellToCustomer.lastName
    const buyerId = this.sellToCustomer.id
    if(confirm("You are transferring "+carPlate+" to "+fullname)){
      await firstValueFrom(this.carSvc.putCarOnSale(carId,buyerId)).then((response:any)=>{
        alert(response.message);
        this.router.navigate(['/dashboard']);
      });
    }
    
  }
}
