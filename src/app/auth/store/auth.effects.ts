import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {User} from '../user.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthResponseData} from './auth-response-data';
import * as AuthActions from './auth.actions';

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

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap(action => {
        return this.http
          .post<AuthResponseData>(SIGNUP_URL,
            {email: action.email, password: action.password, returnSecureToken: true})
          .pipe(
            map(authResponse => AuthActions.authenticateSuccess({user: this.handleAuthentication(authResponse), doRedirect: true})),
            catchError(errorRes => of(AuthActions.authenticateFail({errorMessage: handleError(errorRes)}))));
      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(action => {
        return this.http
          .post<AuthResponseData>(LOGIN_URL,
            {email: action.email, password: action.password, returnSecureToken: true})
          .pipe(
            map(authResponse => AuthActions.authenticateSuccess({user: this.handleAuthentication(authResponse), doRedirect: true})),
            catchError(errorRes => of(AuthActions.authenticateFail({errorMessage: handleError(errorRes)}))));
      })
    )
  );

  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap(action => action.doRedirect && this.router.navigate(['/']))
    ), {dispatch: false}
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
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

            return AuthActions.authenticateSuccess({user: loadedUser, doRedirect: false});
          }
        }
        return {type: 'DUMMY'};
      })
    )
  );

  authLogout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem(LOCALSTORAGE_USERDATA_KEY);
          this.router.navigate(['/auth']);
        })),
    {dispatch: false}
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

