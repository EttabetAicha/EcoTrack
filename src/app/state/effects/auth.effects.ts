import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  addPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.addPoints),
      mergeMap(action =>
        this.authService.addPoints(action.userId, action.points).pipe(
          map(() => AuthActions.addPointsSuccess({ userId: action.userId, points: action.points })),
          catchError(error => of(AuthActions.addPointsFailure({ error })))
        )
      )
    )
  );

  convertPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.convertPoints),
      mergeMap(action =>
        this.authService.convertPoints(action.userId, action.points).pipe(
          map(result =>
            result.success
              ? AuthActions.convertPointsSuccess({ userId: action.userId, points: action.points, voucher: result.voucher })
              : AuthActions.convertPointsFailure({ error: 'Conversion failed' })
          ),
          catchError(error => of(AuthActions.convertPointsFailure({ error })))
        )
      )
    )
  );
}
