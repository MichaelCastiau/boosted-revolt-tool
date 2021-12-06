import { combineLatest, OperatorFunction } from 'rxjs';
import { IAppState } from '../../store/store';
import { IVESCInfo, selectVESCState } from './store';
import { select } from '@ngrx/store';
import { filter, first, map } from 'rxjs/operators';
import { IAppData } from '../app-data';
import { HttpErrorResponse } from '@angular/common/http';
import { selectBLEState } from '../../ble/store/ble.store';
import { ConnectionMethod } from '@shared/types';

export const selectIsConnecting: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.isConnecting)
);

export const selectConnectionError: OperatorFunction<IAppState, Error> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.errorConnecting)
);

export const selectIsConnected: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.isConnected)
);

export const selectVESCInfo: OperatorFunction<IAppState, IVESCInfo> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.VESCInfo)
);

export const selectDashboardBatteryConfiguration: OperatorFunction<IAppState, number> = state$ => state$.pipe(
  select(selectVESCState),
  map(state => state?.dashboardConfig?.batteryConfiguration)
);

export const selectDashboardMetricSystem: OperatorFunction<IAppState, 'kmh' | 'mph'> = state$ => state$.pipe(
  select(selectVESCState),
  map(state => state?.dashboardConfig?.metricSystem)
);

export const selectDashboardWheelCircumference: OperatorFunction<IAppState, number> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state?.dashboardConfig?.wheelCircumference)
);

export const selectAppSettings: OperatorFunction<IAppState, IAppData> = state$ => state$.pipe(
  select(selectVESCState),
  map(state => state.VESCInfo?.app)
);
export const selectWritingAppSettings: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.writingAppSettings)
);

export const selectConfiguringDashboardError: OperatorFunction<IAppState, Error | HttpErrorResponse> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.errorConfiguringDashboard),
  filter(error => !!error)
);
export const selectConfiguringVESCError: OperatorFunction<IAppState, HttpErrorResponse> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.errorConfiguringVESC),
  filter(error => !!error)
);

export const selectConnectionProps: OperatorFunction<IAppState, { connectionType: ConnectionMethod, deviceId?: string }> = state$ => combineLatest([
  state$.pipe(
    select(selectBLEState),
    select(state => state.connectingToDeviceId)
  ),
  state$.pipe(
    select(selectVESCState),
    select(state => state.connectionType)
  )
]).pipe(
  map(([deviceId, connectionType]) => ({ connectionType, deviceId })),
  first()
);
