import {Action} from '@ngrx/store';
import {User} from '../user.model';

export const LOGIN = '[Auth] LOGIN';
export const SIGNUP = '[Auth] SIGNUP';
export const LOGOUT = '[Auth] LOGOUT';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: User) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;

  constructor() {
  }
}

export type AuthActions = Login | Logout;
