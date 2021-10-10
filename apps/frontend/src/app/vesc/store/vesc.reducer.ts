import { createReducer, on } from '@ngrx/store';
import { IVESCState } from './store';
import { connectToVESC, connectToVESCFail, connectToVESCSuccess } from './vesc.actions';

export const vescReducer = createReducer<IVESCState>({ isConnecting: false },
  on(connectToVESC, (state) => ({ ...state, isConnecting: true, errorConnecting: null })),
  on(connectToVESCFail, (state, { error }) => ({ ...state, isConnecting: false, errorConnecting: error })),
  on(connectToVESCSuccess, (state, {port}) => ({...state, portInfo: port}))
);
