import { createReducer, on } from '@ngrx/store';
import { IVESCState } from './store';
import { connectToVESC, connectToVESCFail, connectToVESCSuccess } from './vesc.actions';

export const vescReducer = createReducer<IVESCState>({ isConnecting: false, isConnected: false },
  on(connectToVESC, (state) => ({ ...state, isConnecting: true, errorConnecting: null })),
  on(connectToVESCFail, (state, { error }) => ({
    ...state,
    isConnecting: false,
    isConnected: false,
    errorConnecting: error
  })),
  on(connectToVESCSuccess, (state, { info }) => ({ ...state, portInfo: info, isConnected: true, isConnecting: false }))
);
