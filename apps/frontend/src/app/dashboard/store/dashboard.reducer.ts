import { createReducer, on } from '@ngrx/store';
import { IDashboardState } from './store';
import {
  connectToVESC,
  setPIDSuccess,
  setUseADCThrottleSuccess,
  setUseCurrentControlSuccess
} from '../../vesc/store/vesc.actions';

export const dashboardReducer = createReducer<IDashboardState>({
    isLoading: false, adcIsEnabled: true, isCurrentControl: true, pid: {
      kp: 2,
      ki: 0.01,
      kd: 0.001
    }
  },
  on(connectToVESC, (state) => ({ ...state, loadingMessage: 'Connecting to VESC...' })),
  on(setUseADCThrottleSuccess, (state, { useADCThrottle }) => ({
    ...state,
    adcIsEnabled: useADCThrottle
  })),
  on(setUseCurrentControlSuccess, (state, { useCurrentControl }) => ({
    ...state,
    isCurrentControl: useCurrentControl
  })),
  on(setPIDSuccess, (state, { pid }) => ({
    ...state,
    pid
  }))
);
