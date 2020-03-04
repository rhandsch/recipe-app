import {createAction, props} from '@ngrx/store';
import {User} from '../user.model';

export const signupStart = createAction('[Auth] Signup Start', props<{ email: string; password: string }>());
export const loginStart = createAction('[Auth] Login Start', props<{ email: string; password: string }>());
export const authenticateSuccess = createAction('[Auth] Authenticate Success', props<{ user: User, doRedirect: boolean }>());
export const authenticateFail = createAction('[Auth] Authenticate Fail', props<{ errorMessage: string }>());
export const clearError = createAction('[Auth] Clear Error');
export const autoLogin = createAction('[Auth] Auto Login');
export const logout = createAction('[Auth] Logout');
