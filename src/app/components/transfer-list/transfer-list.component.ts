import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { error } from 'jquery';
import { firstValueFrom, map } from 'rxjs';
import { Car } from 'src/app/models/car.model';
import { User } from 'src/app/models/user.model';
import { CarService } from 'src/app/services/car.service';
import { StripeService } from 'src/app/services/stripe.service';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment.development';
import { Payment } from 'src/app/models/payment.model';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent implements OnInit{

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
  stripePromise = loadStripe(environment.stripe);
  user = new User();
  carsToBuy: Car[]=[]
  carsExist!:boolean

  constructor(private breakpointObserver: BreakpointObserver,
            private carSvc:CarService, private stripeSvc:StripeService){}
  
  async ngOnInit(){
    if(sessionStorage.getItem('userdetails')){
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }
    await firstValueFrom(this.carSvc.getCarsSoldTo(this.user.id)).then(result=>{
      this.carsToBuy = result;
      this.carsExist = this.carsToBuy.length > 0
    }).catch(error=>{
      console.log(error);
    })

    this.carsToBuy = [
        // {id:1,carPlate:"S123456",brand:"Toyota",model:"Vios",yearManufactured: 1998},
        // {id:6,carPlate:"S324258",brand:"Honda",model:"CRV",yearManufactured: 2016},
        // {id:7,carPlate:"S124650",brand:"Mercedes",model:"A-Class",yearManufactured: 2001},
        {id:8,carPlate:"S125653",brand:"Audi",model:"V8",yearManufactured: 2022}
      ]; 
      this.carsExist = true
  }

  purchase(){
    alert('implement purchase')
  }
  async pay(index:number): Promise<void> {
    // here we create a payment object
    const car: Car = this.carsToBuy[index];
    const payment:Payment = {
      name: car.carPlate,
      currency: 'usd',
      amount: 500,
      quantity: 1,
      cancelUrl: 'http://146.190.202.70/pay/cancel',
      successUrl: 'http://146.190.202.70/pay/success?'+'newCar='+car.carPlate,
    };

    const stripe = await this.stripePromise;

    this.stripeSvc.payViaStripe(payment).subscribe((result: any) => {
        stripe?.redirectToCheckout({
          sessionId: result.id,
      });
    });
  }

}
