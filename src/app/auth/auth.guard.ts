import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.userChanged.getValue()) {
      return true;
    } else {
      return this.router.createUrlTree(['/auth']);
    }
  }
}
