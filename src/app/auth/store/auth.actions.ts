import {Action} from '@ngrx/store';
import {User} from '../user.model';

export const SIGNUP_START = '[Auth] Signup Start';
export const LOGIN_START = '[Auth] Login Start';
export const AUTH_SUCCESS = '[Auth] Login Success';
export const AUTH_FAIL = '[Auth] Login Fail';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string, password: string; }) {
  }
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string; }) {
  }
}

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload: { user: User, doRedirect: boolean }) {
  }
}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL;

  constructor(public payload: string) {
  }
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = SignupStart | LoginStart | AuthSuccess | AuthFail | ClearError | AutoLogin | Logout;
