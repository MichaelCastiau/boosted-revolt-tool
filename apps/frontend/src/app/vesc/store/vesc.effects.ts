import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  connectToVESC,
  connectToVESCFail,
  connectToVESCSuccess,
  setBatteryConfiguration,
  setBatteryConfigurationSuccess,
  setMetricSystem,
  setMetricSystemSuccess
} from './vesc.actions';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { VESCService } from '../services/vesc.service';
import { of } from 'rxjs';

@Injectable()
export class VESCEffects {
  connectToVESC$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESC),
    delay(700),
    switchMap(() => this.api.connect().pipe(
      map((info) => connectToVESCSuccess({ info })),
      catchError(error => of(connectToVESCFail({ error })))
    ))
  ));

  setBatteryConfiguration = createEffect(() => this.actions$.pipe(
    ofType(setBatteryConfiguration),
    switchMap((action) => this.api.setBatteryConfiguration(action.configuration).pipe(
      map(() => setBatteryConfigurationSuccess({ configuration: action.configuration }))
    ))
  ));

  setMetricSystem = createEffect(() => this.actions$.pipe(
    ofType(setMetricSystem),
    switchMap(action => this.api.setMetricSystem({ system: action.system }).pipe(
      map(() => setMetricSystemSuccess({ system: action.system }))
    ))
  ));

  constructor(private actions$: Actions, private api: VESCService) {
  }
}
