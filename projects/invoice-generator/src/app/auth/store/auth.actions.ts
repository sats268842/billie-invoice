import { createAction, props } from '@ngrx/store';

// import from './actionTypes';

// export const login = createAction(
//     ActionTypes.REGISTER,
//     props<{ email: string; email_verified: boolean; family_name: string; given_name: string; name: string; picture: string; sub: string; }>()
// );

export const checkAuth = createAction('[Auth] checkAuth');
export const login = createAction('[Auth] login');

export const loginComplete = createAction('[Auth] loginComplete', props<{ isLoggedIn: boolean; profile: any }>());

export const logout = createAction('[Auth] logout');
export const logoutComplete = createAction('[Auth] logoutComplete');

// const new LoginAction =login({user: Currentuser})
