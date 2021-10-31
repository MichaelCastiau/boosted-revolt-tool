import { createAction, props } from '@ngrx/store';
import { IDeviceInfo } from '@shared/device';

export const startScanning = createAction('[BLE] Start scanning');
export const foundBLEDevice = createAction('[BLE] Device found', props<{ device: IDeviceInfo }>());
