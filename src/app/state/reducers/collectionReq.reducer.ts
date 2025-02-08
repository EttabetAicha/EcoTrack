import { createReducer, on } from '@ngrx/store';
import * as CollectionActions from '../actions/collectionReq.actions';
import { CollectionRequest } from '../../core/models/CollectionRequest.interface';

export interface CollectionState {
  requests: CollectionRequest[];
  error: any;
  loading: boolean;
  requestCount: number;

}

export const initialState: CollectionState = {
  requests: [],
  error: null,
  loading: false,
  requestCount: 0,

};

export const collectionReducer = createReducer(
  initialState,
  on(CollectionActions.loadRequests, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionActions.loadRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false,
    error: null
  })),
  on(CollectionActions.loadRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CollectionActions.createRequest, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionActions.createRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
    loading: false,
    error: null
  })),
  on(CollectionActions.createRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionActions.updateRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionActions.updateRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map(r => r.id === request.id ? request : r),
    loading: false,
    error: null
  })),
  on(CollectionActions.updateRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionActions.deleteRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionActions.deleteRequestSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter(r => r.id !== id),
    loading: false,
    error: null
  })),
  on(CollectionActions.deleteRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CollectionActions.fetchRequestCountSuccess, (state, { count }) => ({
    ...state,
    requestCount: count,
    error: null,
  })),
  on(CollectionActions.fetchRequestCountFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(CollectionActions.fetchTotalWeightSuccess, (state, { totalWeight }) => ({
    ...state,
    totalWeight,
    error: null,
  })),
  on(CollectionActions.fetchTotalWeightFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(CollectionActions.loadRequestsByCity, state => ({
    ...state,
    error: null
  })),
  on(CollectionActions.loadRequestsByCitySuccess, (state, { requests }) => ({
    ...state,
    requests
  })),
  on(CollectionActions.loadRequestsByCityFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
