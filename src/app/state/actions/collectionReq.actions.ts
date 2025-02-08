import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../../core/models/CollectionRequest.interface';

export const loadRequests = createAction('[Collection] Load Requests');
export const loadRequestsSuccess = createAction('[Collection] Load Requests Success', props<{ requests: CollectionRequest[] }>());
export const loadRequestsFailure = createAction('[Collection] Load Requests Failure', props<{ error: any }>());

export const createRequest = createAction(
  '[Collection] Create Request'
  , props<{ request: CollectionRequest }>());
export const createRequestSuccess = createAction('[Collection] Create Request Success', props<{ request: CollectionRequest }>());
export const createRequestFailure = createAction('[Collection] Create Request Failure', props<{ error: any }>());

export const updateRequest = createAction('[Collection] Update Request', props<{ request: CollectionRequest }>());
export const updateRequestSuccess = createAction('[Collection] Update Request Success', props<{ request: CollectionRequest }>());
export const updateRequestFailure = createAction('[Collection] Update Request Failure', props<{ error: any }>());

export const deleteRequest = createAction('[Collection] Delete Request', props<{ id: number }>());
export const deleteRequestSuccess = createAction('[Collection] Delete Request Success', props<{ id: number }>());
export const deleteRequestFailure = createAction('[Collection] Delete Request Failure', props<{ error: any }>());

export const fetchRequestCount = createAction(
  '[Collection] Fetch Request Count',
  props<{ userId: string }>()
);

export const fetchRequestCountSuccess = createAction(
  '[Collection] Fetch Request Count Success',
  props<{ count: number }>()
);

export const fetchRequestCountFailure = createAction(
  '[Collection] Fetch Request Count Failure',
  props<{ error: any }>()
);
export const fetchTotalWeight = createAction('[Collection] Fetch Total Weight', props<{ userId: string }>());
export const fetchTotalWeightSuccess = createAction('[Collection] Fetch Total Weight Success', props<{ totalWeight: number }>());
export const fetchTotalWeightFailure = createAction('[Collection] Fetch Total Weight Failure', props<{ error: any }>());
export const loadRequestsByCity = createAction(
  '[Collector] Load Requests By City',
  props<{ city: string }>()
);

export const loadRequestsByCitySuccess = createAction(
  '[Collector] Load Requests By City Success',
  props<{ requests: any[] }>()
);

export const loadRequestsByCityFailure = createAction(
  '[Collector] Load Requests By City Failure',
  props<{ error: any }>()
);
