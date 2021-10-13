import { createReducer, on } from '@ngrx/store';
import { IVESCState } from './store';
import {
  connectionLost,
  connectToVESC,
  connectToVESCFail,
  connectToVESCSuccess,
  setBatteryConfigurationSuccess,
  setMetricSystemSuccess
} from './vesc.actions';

export const vescReducer = createReducer<IVESCState>({ isConnecting: false, isConnected: false, dashboardConfig: {} },
  on(connectToVESC, (state) => ({ ...state, isConnecting: true, errorConnecting: null })),
  on(connectToVESCFail, (state, { error }) => ({
    ...state,
    isConnecting: false,
    isConnected: false,
    errorConnecting: error
  })),
  on(connectionLost, (state) => {
    return {
      ...state,
      isConnecting: false,
      isConnected: false,
      errorConnecting: new Error('serial port is closed')
    };
  }),
  on(connectToVESCSuccess, (state, { info }) => ({ ...state, vescInfo: info, isConnected: true, isConnecting: false })),
  on(setBatteryConfigurationSuccess, (state, { configuration }) => {
    return {
      ...state,
      dashboardConfig: {
        ...state.dashboardConfig,
        batteryConfiguration: configuration
      }
    };
  }),
  on(setMetricSystemSuccess, (state, { system }) => {
    return {
      ...state,
      dashboardConfig: {
        ...state.dashboardConfig,
        metricSystem: system
      }
    };
  })
);
