import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../store/store';
import { PIDParameter } from '@shared/types';

export interface IDashboardState {
  isLoading?: boolean;
  loadingMessage?: string;
  adcIsEnabled: boolean;
  isCurrentControl: boolean;
  pid: PIDParameter;
}

export const selectDashboardState = createFeatureSelector< IDashboardState>('dashboard');
