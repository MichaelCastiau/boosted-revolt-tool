import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { connectToVESC, connectToVESCFail, connectToVESCSuccess } from './vesc.actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { VESCService } from '../services/vesc.service';
import { of } from 'rxjs';

@Injectable()
export class VESCEffects {
  connectToVESC$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESC),
    delay(700),
    switchMap(() => this.api.connect().pipe(
      map((port) => connectToVESCSuccess({ port })),
      catchError(error => of(connectToVESCFail({ error })))
    ))
  ));

  constructor(private actions$: Actions, private api: VESCService) {
  }
}
