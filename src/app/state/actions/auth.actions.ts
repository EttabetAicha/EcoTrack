import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: any }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

export const register = createAction('[Auth] Register', props<{ user: any }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: any }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: any }>());
export const addPoints = createAction(
  '[User] Add Points',
  props<{ userId: string, points: number }>()
);

export const addPointsSuccess = createAction(
  '[User] Add Points Success',
  props<{ userId: string, points: number }>()
);

export const addPointsFailure = createAction(
  '[User] Add Points Failure',
  props<{ error: any }>()
);

export const convertPoints = createAction(
  '[User] Convert Points',
  props<{ userId: string, points: number }>()
);

export const convertPointsSuccess = createAction(
  '[User] Convert Points Success',
  props<{ userId: string, points: number, voucher: string }>()
);

export const convertPointsFailure = createAction(
  '[User] Convert Points Failure',
  props<{ error: any }>()
);
