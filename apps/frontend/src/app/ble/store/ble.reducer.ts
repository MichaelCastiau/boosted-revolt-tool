import { createReducer, on } from '@ngrx/store';
import { IBLEState } from './ble.store';
import { connectToVESCViaBLE, foundBLEDevice, startScanning, stopScanning } from './ble.actions';
import { connectionLost, connectToVESCFail } from '../../vesc/store/vesc.actions';

export const bleReducer = createReducer<IBLEState>({
    isScanning: false,
    devicesFound: []
  },
  on(startScanning, (state) => ({ ...state, isScanning: true, devicesFound: [] })),
  on(foundBLEDevice, (state, { device }) => ({ ...state, devicesFound: [...state.devicesFound, device] })),
  on(stopScanning, (state) => ({ ...state, isScanning: false })),
  on(connectToVESCViaBLE, (state, { deviceId }) => ({ ...state, connectingToDeviceId: deviceId })),
  on(connectToVESCFail, connectionLost, (state) => ({
    ...state,
    isScanning: false,
    devicesFound: []
  }))
);
