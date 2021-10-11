import { OperatorFunction } from 'rxjs';
import { IAppState } from '../../store/store';
import { selectVESCState } from './store';
import { select } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IVESCInfo } from '../vesc-types';

export const selectIsConnecting: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.isConnecting)
);

export const selectConnectionError: OperatorFunction<IAppState, HttpErrorResponse> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.errorConnecting)
);

export const selectIsConnected: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.isConnected)
);

export const selectVESCInfo: OperatorFunction<IAppState, IVESCInfo> = state$ => state$.pipe(
  select(selectVESCState),
  select(state => state.vescInfo)
);
