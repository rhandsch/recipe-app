import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {AuthSuccess} from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {User} from '../user.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthResponseData} from './auth-response-data';

const LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;
const SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey;
const LOCALSTORAGE_USERDATA_KEY = 'userData';

const handleError = (errorRes: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred';
  if (errorRes.error && errorRes.error.error) {
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email could not be found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user is disabled';
        break;
    }
  }
  return errorMessage;
};

@Injectable()
export class AuthEffects {

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(LOGIN_URL,
          {email: authData.payload.email, password: authData.payload.password, returnSecureToken: true})
        .pipe(
          map(authResponse => new AuthActions.AuthSuccess({user: this.handleAuthentication(authResponse), doRedirect: true})),
          catchError(errorRes => of(new AuthActions.AuthFail(handleError(errorRes)))));
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(SIGNUP_URL,
          {email: authData.payload.email, password: authData.payload.password, returnSecureToken: true})
        .pipe(
          map(authResponse => new AuthActions.AuthSuccess({user: this.handleAuthentication(authResponse), doRedirect: true})),
          catchError(errorRes => of(new AuthActions.AuthFail(handleError(errorRes)))))
        ;
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((authSuccess: AuthSuccess) => {
      if (authSuccess.payload.doRedirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDATA_KEY));
      if (userData) {
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData.tokenExpirationDate));
        if (loadedUser.token) {
          console.log('autologin user:', loadedUser);

          const leftExpirationMillis = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(leftExpirationMillis);

          return new AuthActions.AuthSuccess({user: loadedUser, doRedirect: false});
        }
      }
      return {type: 'DUMMY'};
    })
  );

  @Effect({dispatch: false})
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem(LOCALSTORAGE_USERDATA_KEY);
      this.router.navigate(['/auth']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  handleAuthentication(authResponse: AuthResponseData) {
    const expiresInMillis = authResponse.expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    const user = new User(authResponse.email, authResponse.localId, authResponse.idToken, expirationDate);
    console.log('User authenticated:', user);
    localStorage.setItem(LOCALSTORAGE_USERDATA_KEY, JSON.stringify(user));
    this.authService.setLogoutTimer(expiresInMillis);
    return user;
  }

}

