import {User} from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.SIGNUP_START:
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        authError: null,
        loading: false
      };
    case AuthActions.AUTH_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        authError: null
      };
    default:
      return state;
  }
}
