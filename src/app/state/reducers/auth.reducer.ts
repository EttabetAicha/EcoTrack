import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: any | null;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.registerSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(AuthActions.registerFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.addPointsSuccess, (state, { userId, points }) => {
    if (state.user && state.user.id === userId) {
      return { ...state, user: { ...state.user, points: (state.user.points || 0) + points } };
    }
    return state;
  }),
  on(AuthActions.convertPointsSuccess, (state, { userId, points }) => {
    if (state.user && state.user.id === userId) {
      return { ...state, user: { ...state.user, points } };
    }
    return state;
  }),
  on(AuthActions.addPointsFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.convertPointsFailure, (state, { error }) => ({ ...state, error }))
);
