import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../core/models/user.interface';
import { CollectionRequest } from '../../core/models/CollectionRequest.interface';

export interface AuthState {
  user: User | null;
  error: string | null;
  convertPointsSuccess: { collectionRequest: CollectionRequest; voucher: string } | null;
  voucher: string | null;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  convertPointsSuccess: null,  // Ensure it is initialized to null
  voucher: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.updateUser, (state, { user }) => ({
    ...state,
    user
  })),

  on(AuthActions.addPointsAfterCollection, state => ({
    ...state,
    error: null
  })),

  on(AuthActions.addPointsSuccess, (state, { user }) => ({
    ...state,
    user,
    error: null
  })),

  on(AuthActions.addPointsFailure, (state, { error }) => ({
    ...state,
    error,
    convertPointsSuccess: null
  })),
  on(AuthActions.convertPointsSuccess, (state, { collectionRequest, voucher }) => {
    console.log('convertPointsSuccess action dispatched', { collectionRequest, voucher });
    return {
      ...state,
      convertPointsSuccess: { collectionRequest, voucher },
      error: null
    };
  }),

  on(AuthActions.convertPointsFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
