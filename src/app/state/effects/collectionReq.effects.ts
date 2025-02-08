import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CollectionService } from '../../core/services/collection.service';
import { catchError, debounceTime, map, mergeMap, of } from 'rxjs';
import * as CollectionActions from '../actions/collectionReq.actions';

@Injectable()
export class CollectionEffects {
  private actions$ = inject(Actions);
  private collectionService = inject(CollectionService);

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.loadRequests),
      mergeMap(() =>
        this.collectionService.getRequests().pipe(
          map((requests) => CollectionActions.loadRequestsSuccess({ requests })),
          catchError((error) => of(CollectionActions.loadRequestsFailure({ error })))
        )
      )
    )
  );
  createRequest$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CollectionActions.createRequest),
    debounceTime(300),
    mergeMap((action) =>
      this.collectionService.createRequest(action.request).pipe(
        map((newRequest) => CollectionActions.createRequestSuccess({ request: newRequest })),
        catchError((error) => of(CollectionActions.createRequestFailure({ error })))
      )
    )
  )
);
updateRequest$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CollectionActions.updateRequest),
    mergeMap((action) =>
      this.collectionService.updateRequest(action.request).pipe(
        map((updatedRequest) => CollectionActions.updateRequestSuccess({ request: updatedRequest })),
        catchError((error) => of(CollectionActions.updateRequestFailure({ error })))
      )
    )
  )
);

deleteRequest$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CollectionActions.deleteRequest),
    mergeMap((action) =>
      this.collectionService.deleteRequest(action.id).pipe(
        map(() => CollectionActions.deleteRequestSuccess({ id: action.id })),
        catchError((error) => of(CollectionActions.deleteRequestFailure({ error })))
      )
    )
  )
);

fetchRequestCount$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CollectionActions.fetchRequestCount),
    mergeMap(action =>
      this.collectionService.getRequestCountByUser().pipe(
        map(count => {
          console.log('Fetched request count:', count);
          return CollectionActions.fetchRequestCountSuccess({ count });
        }),
        catchError(error => {
          console.error('Error fetching request count:', error);
          return of(CollectionActions.fetchRequestCountFailure({ error }));
        })
      )
    )
  )
);
fetchTotalWeight$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CollectionActions.fetchTotalWeight),
    mergeMap(action =>
      this.collectionService.getTotalWeightByUser().pipe(
        map(totalWeight => CollectionActions.fetchTotalWeightSuccess({ totalWeight })),
        catchError(error => of(CollectionActions.fetchTotalWeightFailure({ error })))
      )
    )
  )

);
loadRequestsByCity$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CollectionActions.loadRequestsByCity),
    mergeMap(action =>
      this.collectionService.getRequestsByCity(action.city).pipe(
        map(requests => CollectionActions.loadRequestsByCitySuccess({ requests })),
        catchError(error => of(CollectionActions.loadRequestsByCityFailure({ error })))
      )
    )
  )
);

}
