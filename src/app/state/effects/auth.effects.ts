import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      mergeMap(action =>
        this.authService.updateProfile(action.user).pipe(
          map(() => AuthActions.updateUserSuccess({ user: action.user })),
          catchError(error => of(AuthActions.updateUserFailure({ error })))
        )
      )
    )
  );

  addPointsAfterCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.addPointsAfterCollection),
      mergeMap(action =>
        this.authService.addPointsAfterCollection(
          action.userId,
          action.wasteTypes,
          action.weight
        ).pipe(
          map(user => AuthActions.addPointsSuccess({ user })),
          catchError(error => of(AuthActions.addPointsFailure({ error: error.message })))
        )
      )
    )
  );

  convertPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.convertPoints),
      mergeMap(action =>
        this.authService.convertPoints(action.points, action.collectionRequest).pipe(
          map(result => AuthActions.convertPointsSuccess({
            collectionRequest: result.collectionRequest,
            voucher: result.voucher
          })),
          catchError(error => of(AuthActions.convertPointsFailure({ error: error.message })))
        )
      )
    )
  );
}
