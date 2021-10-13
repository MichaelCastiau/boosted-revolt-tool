import { createReducer, on } from '@ngrx/store';
import { IDashboardState } from './store';
import { connectToVESC } from '../../vesc/store/vesc.actions';

export const dashboardReducer = createReducer<IDashboardState>({ isLoading: false },
  on(connectToVESC, (state) => ({ loadingMessage: 'Connecting to VESC...' }))
);
