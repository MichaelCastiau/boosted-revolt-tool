import { OperatorFunction } from 'rxjs';
import { IAppState } from '../../store/store';
import { select } from '@ngrx/store';
import { selectDashboardState } from './store';
import { selectAppSettings } from '../../vesc/store/vesc.selectors';
import { filter, map } from 'rxjs/operators';
import { IAppData } from '../../vesc/app-data';
import { AppUse } from '../../../../../electron/src/app/vesc/models/datatypes';

export const selectIsLoading: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectDashboardState),
  select(state => state.isLoading)
);

export const selectLoadingMessage: OperatorFunction<IAppState, string> = state$ => state$.pipe(
  select(selectDashboardState),
  select(state => state.loadingMessage)
);

export const selectVESCIsConfiguredForDashboard: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  selectAppSettings,
  filter(settings => !!settings),
  map((settings: IAppData) => {
    return settings.general.appToUse === AppUse.APP_ADC
      || settings.general.appToUse === AppUse.APP_ADC_UART
      || settings.general.appToUse === AppUse.APP_ADC_PAS;
  })
);
