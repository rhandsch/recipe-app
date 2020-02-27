import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  idToken: string; // A Firebase Auth ID token for the newly created user.
  email: string;	// The email for the newly created user.
  refreshToken: string; // A Firebase Auth refresh token for the newly created user.
  expiresIn: number;	// The number of seconds in which the ID token expires.
  localId: string; // The uid of the newly created user.
  registered?: boolean; // Whether the email is for an existing account
}


@Injectable({providedIn: 'root'})
export class AuthService {

  private readonly SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey;
  private readonly LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;
  private readonly LOCALSTORAGE_USERDATA_KEY = 'userData';

  private tokenExpirationTimer;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData.tokenExpirationDate));
    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.Login(loadedUser));
      const leftExpirationMillis = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(leftExpirationMillis);
    }
  }

  autoLogout(expirationDurationMillis: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDurationMillis);
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.SIGNUP_URL, {email, password, returnSecureToken: true})
      .pipe(
        catchError(this.handleError),
        tap(authResponse => this.handleAuthentication(authResponse))
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.LOGIN_URL, {email, password, returnSecureToken: true})
      .pipe(
        catchError(this.handleError),
        tap(authResponse => this.handleAuthentication(authResponse))
      );
  }


  logout() {
    localStorage.removeItem(this.LOCALSTORAGE_USERDATA_KEY);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(authResponse: AuthResponseData) {
    const expiresInMillis = authResponse.expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    const user = new User(authResponse.email, authResponse.localId, authResponse.idToken, expirationDate);
    console.log('User authenticated', user);
    this.store.dispatch(new AuthActions.Login(user));
    this.autoLogout(expiresInMillis);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
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
    return throwError(errorMessage);
  }

}
