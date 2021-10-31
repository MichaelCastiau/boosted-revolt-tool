import { IDeviceInfo } from '@shared/device';
import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../store/store';

export interface IBLEState {
  isScanning?: boolean;
  devicesFound?: Array<IDeviceInfo>;
}

export const selectBLEState = createFeatureSelector<IAppState, IBLEState>('ble');
