import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';

export interface AuthResponseData {
  idToken: string; // A Firebase Auth ID token for the newly created user.
  email: string;	// The email for the newly created user.
  refreshToken: string; // A Firebase Auth refresh token for the newly created user.
  expiresIn: number;	// The number of seconds in which the ID token expires.
  localId: string; // The uid of the newly created user.
  registered?: boolean; // Whether the email is for an existing account
}

const FIREBASE_APIKEY_PARAM = 'key=AIzaSyDHxVf7fEo4PYrty61ok3UJv69a0lHE_KY';

@Injectable({providedIn: 'root'})
export class AuthService {

  userChanged = new BehaviorSubject<User>(null);

  private readonly SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?' + FIREBASE_APIKEY_PARAM;
  private readonly LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?' + FIREBASE_APIKEY_PARAM;
  private readonly LOCALSTORAGE_USERDATA_KEY = 'userData';

  private tokenExpirationTimer;

  constructor(private http: HttpClient, private router: Router) {
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
      this.userChanged.next(loadedUser);
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
        tap(authResponse => this.handleAuthentication(authResponse, this.userChanged))
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.LOGIN_URL, {email, password, returnSecureToken: true})
      .pipe(
        catchError(this.handleError),
        tap(authResponse => this.handleAuthentication(authResponse, this.userChanged))
      );
  }


  logout() {
    localStorage.removeItem(this.LOCALSTORAGE_USERDATA_KEY);
    this.userChanged.next(null);
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(authResponse: AuthResponseData, userChanged: Subject<User>) {
    const expiresInMillis = authResponse.expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMillis);
    const u = new User(authResponse.email, authResponse.localId, authResponse.idToken, expirationDate);
    console.log('User authenticated', u);
    userChanged.next(u);
    this.autoLogout(expiresInMillis);
    localStorage.setItem('userData', JSON.stringify(u));
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
