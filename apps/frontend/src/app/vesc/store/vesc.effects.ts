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
  connectToVESCViaUSB,
  disconnect,
  getAppSettings,
  getAppSettingsFail,
  getAppSettingsSuccess,
  setBatteryConfiguration,
  setBatteryConfigurationSuccess,
  setMetricSystem,
  setMetricSystemSuccess,
  setWheelCircumference,
  setWheelCircumferenceSuccess
} from './vesc.actions';
import { catchError, delay, map, mapTo, switchMap, take, tap, timeout } from 'rxjs/operators';
import { VESCService } from '../services/vesc.service';
import { Observable, of } from 'rxjs';
import { WebsocketService } from '../../shared/services/websocket.service';
import { Action, Store } from '@ngrx/store';
import { IAppData } from '../app-data';
import { ToastrService } from 'ngx-toastr';
import { connectToVESCViaBLE } from '../../ble/store/ble.actions';
import { selectConnectionProps } from './vesc.selectors';
import { IAppState } from '../../store/store';

@Injectable()
export class VESCEffects {
  connectViaBLE$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESCViaBLE),
    mapTo(connectToVESC())
  ));

  connectViaUSB$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESCViaUSB),
    mapTo(connectToVESC())
  ));

  connectToVESC$ = createEffect(() => this.actions$.pipe(
    ofType(connectToVESC),
    delay(700),
    switchMap(() => this.store.pipe(selectConnectionProps)),
    switchMap((props): Observable<Action> => {
      const socket = this.socket.openSocket();
      socket.next({ event: 'connect', data: props });
      return socket.pipe(
        take(1),
        timeout(10000),
        map((message) => connectToVESCSuccess({ info: message.data.info })),
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

  setWheelCircumference$ = createEffect(() => this.actions$.pipe(
    ofType(setWheelCircumference),
    switchMap(action => this.api.setWheelCircumference(action.circumferenceMM).pipe(
      map(() => setWheelCircumferenceSuccess({ circumferenceMM: action.circumferenceMM })),
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

  disconnect$ = createEffect(() => this.actions$.pipe(
    ofType(disconnect),
    switchMap(() => this.api.disconnect())
  ), { dispatch: false });

  constructor(private actions$: Actions,
              private api: VESCService,
              private store: Store<IAppState>,
              private socket: WebsocketService,
              private toastr: ToastrService) {
  }
}
