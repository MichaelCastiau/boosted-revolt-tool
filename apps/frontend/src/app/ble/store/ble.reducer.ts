import { createReducer, on } from '@ngrx/store';
import { IBLEState } from './ble.store';
import { foundBLEDevice, startScanning } from './ble.actions';

export const bleReducer = createReducer<IBLEState>({
    isScanning: false,
    devicesFound: []
  },
  on(startScanning, (state) => ({ ...state, isScanning: true, devicesFound: [] })),
  on(foundBLEDevice, (state, { device }) => ({ ...state, devicesFound: [...state.devicesFound, device] }))
);
