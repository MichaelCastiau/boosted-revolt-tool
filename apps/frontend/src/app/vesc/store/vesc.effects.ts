import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  configureVESC,
  configureVESCFail,
  configureVESCSuccess,
  configuringDashboardError,
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
import { catchError, delay, map, mapTo, switchMap, take, tap, timeout } from 'rxjs/operators';
import { VESCService } from '../services/vesc.service';
import { Observable, of } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';
import { Action } from '@ngrx/store';
import { WebSocketSubject } from 'rxjs/webSocket';
import { IAppData } from '../app-data';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class VESCEffects {
  connectToVESC$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESC),
    delay(700),
    map(() => this.socket.openSocket()),
    switchMap((socket: WebSocketSubject<any>): Observable<Action> => {
      socket.next({ event: 'connect' });
      return socket.pipe(
        take(1),
        timeout(2500),
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
      map(() => setBatteryConfigurationSuccess({ configuration: action.configuration })),
      tap(() => this.toastr.success('The settings are successfully saved in your dashboard', 'Dashboard Configured')),
      catchError(error => of(configuringDashboardError({ error })))
    ))
  ));

  setMetricSystem = createEffect(() => this.actions$.pipe(
    ofType(setMetricSystem),
    switchMap(action => this.api.setMetricSystem({ system: action.system }).pipe(
      map(() => setMetricSystemSuccess({ system: action.system })),
      tap(() => this.toastr.success('The settings are successfully saved in your dashboard', 'Dashboard Configured')),
      catchError(error => of(configuringDashboardError({ error })))
    ))
  ));

  configureVESC$ = createEffect(() => this.actions$.pipe(
    ofType(configureVESC),
    switchMap(() => this.api.configureVESC().pipe(
      map((appSettings: IAppData) => configureVESCSuccess({ appSettings })),
      tap(() => this.toastr.success('The settings are successfully saved in your VESC', 'VESC Configured')),
      catchError(error => of(configureVESCFail({ error })))
    ))
  ));

  constructor(private actions$: Actions,
              private api: VESCService,
              private socket: WebsocketService,
              private toastr: ToastrService) {
  }
}
