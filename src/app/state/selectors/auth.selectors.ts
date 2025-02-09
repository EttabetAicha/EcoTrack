import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('user');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectConvertPointsSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state?.convertPointsSuccess ?? null  
);

export const selectVoucher = createSelector(
  selectAuthState,
  (state: AuthState) => state.voucher
);
