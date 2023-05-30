import { Component, OnInit } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Payment } from 'src/app/models/payment.model';
import { StripeService } from 'src/app/services/stripe.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.css'],
})
export class StripeCheckoutComponent implements OnInit{
  
  stripePromise = loadStripe(environment.stripe);
  constructor(private stripeSvc: StripeService) {

  }
  
  ngOnInit(): void {
    
  }

  async pay(): Promise<void> {
    // here we create a payment object
    const payment:Payment = {
      name: 'Iphone',
      currency: 'usd',
      amount: 500,
      quantity: 1,
      cancelUrl: 'http://localhost:4200/pay/cancel',
      successUrl: 'http://localhost:4200/pay/success',
    };

    const stripe = await this.stripePromise;

    this.stripeSvc.payViaStripe(payment).subscribe((result: any) => {
        stripe?.redirectToCheckout({
          sessionId: result.id,
      });
    });
  }
}
