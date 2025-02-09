import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/user.interface';
import { CollectionRequest } from '../../core/models/CollectionRequest.interface';

export const addPointsAfterCollection = createAction(
  '[Auth] Add Points After Collection',
  props<{ userId: string; wasteTypes: string[]; weight: number }>()
);
export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: User }>()
);


export const updateUserSuccess = createAction(
  '[Auth] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[Auth] Update User Failure',
  props<{ error: any }>()
);

export const addPointsSuccess = createAction(
  '[Auth] Add Points Success',
  props<{ user: User }>()
);

export const addPointsFailure = createAction(
  '[Auth] Add Points Failure',
  props<{ error: string }>()
);

export const convertPoints = createAction(
  '[Auth] Convert Points',
  props<{ points: number; collectionRequest: CollectionRequest }>()
);

export const convertPointsSuccess = createAction(
  '[Auth] Convert Points Success',
  props<{ collectionRequest: CollectionRequest; voucher: string }>()
);

export const convertPointsFailure = createAction(
  '[Auth] Convert Points Failure',
  props<{ error: string }>()
);
