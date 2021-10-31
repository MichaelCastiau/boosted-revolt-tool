import { OperatorFunction } from 'rxjs';
import { IAppState } from '../../store/store';
import { IDeviceInfo } from '@shared/device';
import { select } from '@ngrx/store';
import { selectBLEState } from './ble.store';

export const selectFoundBLEDevices: OperatorFunction<IAppState, IDeviceInfo[]> = state$ => state$.pipe(
  select(selectBLEState),
  select(state => state.devicesFound || [])
);
