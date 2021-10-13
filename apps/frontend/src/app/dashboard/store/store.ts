import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../store/store';

export interface IDashboardState {
  isLoading?: boolean;
  loadingMessage?: string;
}

export const selectDashboardState = createFeatureSelector<IAppState, IDashboardState>('dashboard');
