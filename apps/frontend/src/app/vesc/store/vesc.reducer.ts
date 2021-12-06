import { createReducer, on } from '@ngrx/store';
import { IVESCState } from './store';
import {
  configureVESC,
  configureVESCFail,
  configureVESCSuccess,
  configuringDashboardError,
  connectionLost,
  connectToVESC,
  connectToVESCFail,
  connectToVESCSuccess,
  connectToVESCViaUSB,
  getAppSettingsSuccess,
  setBatteryConfiguration,
  setBatteryConfigurationSuccess,
  setMetricSystem,
  setMetricSystemSuccess,
  setWheelCircumferenceSuccess
} from './vesc.actions';
import { connectToVESCViaBLE } from '../../ble/store/ble.actions';

export const vescReducer = createReducer<IVESCState>({
    isConnecting: false,
    isConnected: false,
    dashboardConfig: {},
    connectionType: 'usb'
  },
  on(connectToVESCViaUSB, (state) => ({ ...state, connectionType: 'usb' })),
  on(connectToVESCViaBLE, (state) => ({ ...state, connectionType: 'ble' })),
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
  on(connectToVESCSuccess, (state, { info }) => ({
    ...state,
    VESCInfo: info,
    isConnected: true,
    isConnecting: false,
    errorConnecting: null
  })),
  on(configuringDashboardError, (state, { error }) => ({
    ...state,
    errorConfiguringDashboard: error
  })),
  on(setBatteryConfiguration, (state) => ({
    ...state,
    errorConfiguringDashboard: null
  })),
  on(setBatteryConfigurationSuccess, (state, { configuration }) => {
    return {
      ...state,
      dashboardConfig: {
        ...state.dashboardConfig,
        batteryConfiguration: configuration
      }
    };
  }),
  on(setMetricSystem, (state) => ({
    ...state,
    errorConfiguringDashboard: null
  })),
  on(setMetricSystemSuccess, (state, { system }) => {
    return {
      ...state,
      dashboardConfig: {
        ...state.dashboardConfig,
        metricSystem: system
      }
    };
  }),
  on(setWheelCircumferenceSuccess, (state, { circumferenceMM }) => ({
    ...state,
    dashboardConfig: {
      ...state.dashboardConfig,
      wheelCircumference: circumferenceMM
    }
  })),
  on(getAppSettingsSuccess, (state, { appSettings }) => {
    return {
      ...state,
      VESCInfo: {
        ...state.VESCInfo,
        app: appSettings
      }
    };
  }),
  on(configureVESC, (state) => ({ ...state, writingAppSettings: true, errorConfiguringVESC: null })),
  on(configureVESCFail, (state, { error }) => ({ ...state, writingAppSettings: false, errorConfiguringVESC: error })),
  on(configureVESCSuccess, (state, { appSettings }) => ({
    ...state,
    writingAppSettings: false,
    VESCInfo: {
      ...state.VESCInfo,
      app: appSettings
    }
  }))
);
