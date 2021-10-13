import { OperatorFunction } from 'rxjs';
import { IAppState } from '../../store/store';
import { select } from '@ngrx/store';
import { selectDashboardState } from './store';

export const selectIsLoading: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectDashboardState),
  select(state => state.isLoading)
);

export const selectLoadingMessage: OperatorFunction<IAppState, string> = state$ => state$.pipe(
  select(selectDashboardState),
  select(state => state.loadingMessage)
);
