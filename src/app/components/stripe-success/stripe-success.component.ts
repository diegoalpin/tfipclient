import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-stripe-success',
  templateUrl: './stripe-success.component.html',
  styleUrls: ['./stripe-success.component.css']
})
export class StripeSuccessComponent implements OnInit{
  newCarPlate!:string
  user = new User();

  constructor(private activatedRoute:ActivatedRoute, private router:Router,
    private carSvc:CarService){}
  
  ngOnInit(): void {
    if(sessionStorage.getItem('userdetails')){
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
    }
    this.newCarPlate = this.activatedRoute.snapshot.queryParams['newCar'];

    this.doOwnershipTrf(this.newCarPlate);
    
  }
  async doOwnershipTrf(carPlate:string){
      this.carSvc.transferCarOwner(carPlate).subscribe((result:any)=>{
        alert(result['message']);
        this.router.navigate(['/dashboard']);
      });
  }

  goDashboard(){
    this.router.navigate(['/dashboard']);
  }
}
