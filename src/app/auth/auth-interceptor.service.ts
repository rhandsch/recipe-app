import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {exhaustMap, take} from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.userChanged.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        return next.handle(req.clone({
          params: req.params.set('auth', user.token)
        }));
      })
    );
  }

}
