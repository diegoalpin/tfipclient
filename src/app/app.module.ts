import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthActivateRouteGuard } from './routeguards/auth.routeguard';
import { XhrInterceptor } from './interceptors/app.request.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CarComponent } from './components/car/car.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MaintenanceAllComponent } from './components/maintenance-all/maintenance-all.component';
import { AccountComponent } from './components/account/account.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import * as bootstrap from "bootstrap";
import { CarService } from './services/car.service';
import { ItemService } from './services/item.service';
import { MaintenanceService } from './services/maintenance.service';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { AddCarComponent } from './components/add-car/add-car.component';
import { AddMaintenanceComponent } from './components/add-maintenance/add-maintenance.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { EditMaintenanceComponent } from './components/edit-maintenance/edit-maintenance.component';
import { StripeSuccessComponent } from './components/stripe-success/stripe-success.component';
import { StripeCancelComponent } from './components/stripe-cancel/stripe-cancel.component';
import { StripeCheckoutComponent } from './components/stripe-checkout/stripe-checkout.component';
import { StripeService } from './services/stripe.service';
import { UserService } from './services/user.service';
import { TransferListComponent } from './components/transfer-list/transfer-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    NavbarComponent,
    DashboardComponent,
    CarComponent,
    MaintenanceComponent,
    LogoutComponent,
    MaintenanceAllComponent,
    AccountComponent,
    AboutUsComponent,
    LoadingComponent,
    AddCarComponent,
    AddMaintenanceComponent,
    EditMaintenanceComponent,
    StripeSuccessComponent,
    StripeCancelComponent,
    StripeCheckoutComponent,
    TransferListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, ReactiveFormsModule, FormsModule,
    HttpClientModule, 
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    BrowserAnimationsModule, LayoutModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule,MatProgressSpinnerModule, MatInputModule, MatSelectModule, MatRadioModule, MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [AuthActivateRouteGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : XhrInterceptor,
      multi : true
    },
    CarService,ItemService,MaintenanceService,LoadingService, MatDatepickerModule, StripeService,UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
