import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from '../reducers/collectionReq.reducer';

export const selectCollectionState = createFeatureSelector<CollectionState>('collection');

export const selectCollectionRequests = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.requests
);

export const selectCollectionError = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.error
);

export const selectPendingRequests = createSelector(
  selectCollectionRequests,
  (requests) => requests.filter(request => request.status === 'pending')
);
export const selectRequestsByCity = (city: string) => createSelector(
  selectCollectionRequests,
  (requests) => requests.filter(request => request.address.city === city)
);


