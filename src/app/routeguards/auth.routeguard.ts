import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable()
export class AuthActivateRouteGuard implements CanActivate {
  user = new User();

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    if (sessionStorage.getItem('userdetails')) {
      this.user = JSON.parse(sessionStorage.getItem('userdetails')!);
      // console.log('inside route auth guard successful',this.user);
    }
    if (!this.user.id) {
      // console.log('inside route auth guard fail',this.user);
      this.router.navigate(['/login']);
    }
    return this.user ? true : false;
  }
}
