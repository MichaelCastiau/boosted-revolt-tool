import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  configureVESC,
  configureVESCFail,
  configureVESCSuccess,
  connectToVESC,
  connectToVESCFail,
  connectToVESCSuccess,
  getAppSettings,
  getAppSettingsFail,
  getAppSettingsSuccess,
  setBatteryConfiguration,
  setBatteryConfigurationSuccess,
  setMetricSystem,
  setMetricSystemSuccess
} from './vesc.actions';
import { catchError, delay, map, mapTo, switchMap } from 'rxjs/operators';
import { VESCService } from '../services/vesc.service';
import { Observable, of } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';
import { Action } from '@ngrx/store';
import { WebSocketSubject } from 'rxjs/webSocket';
import { IAppData } from '../app-data';

@Injectable()
export class VESCEffects {
  connectToVESC$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESC),
    delay(700),
    map(() => this.socket.openSocket()),
    switchMap((socket: WebSocketSubject<any>): Observable<Action> => {
      socket.next({ event: 'connect' });
      return socket.pipe(
        map(info => connectToVESCSuccess({ info })),
        catchError(error => of(connectToVESCFail({ error })))
      );
    })
  ));

  getAppSettingsOnConnection$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESCSuccess),
    mapTo(getAppSettings())
  ));

  getAppSettings$ = createEffect(() => this.actions$.pipe(
    ofType(getAppSettings),
    switchMap(() => this.api.getAppSettings().pipe(
      map(appSettings => getAppSettingsSuccess({ appSettings })),
      catchError(error => of(getAppSettingsFail({ error })))
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

  configureVESC$ = createEffect(() => this.actions$.pipe(
    ofType(configureVESC),
    switchMap(() => this.api.configureVESC().pipe(
      map((appSettings: IAppData) => configureVESCSuccess({ appSettings })),
      catchError(error => of(configureVESCFail({ error })))
    ))
  ));

  constructor(private actions$: Actions, private api: VESCService, private socket: WebsocketService) {
  }
}
