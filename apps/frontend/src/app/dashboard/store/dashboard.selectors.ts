import { OperatorFunction } from 'rxjs';
import { IAppState } from '../../store/store';
import { select } from '@ngrx/store';
import { selectDashboardState } from './store';
import { selectAppSettings } from '../../vesc/store/vesc.selectors';
import { filter, map } from 'rxjs/operators';
import { IAppData } from '../../vesc/app-data';
import { AppUse, CANBaud, CANMode, CANStatusMode } from '../../../../../electron/src/app/vesc/models/datatypes';
import { PIDParameter } from '@shared/types';

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
    return (settings.general.appToUse === AppUse.APP_ADC
        || settings.general.appToUse === AppUse.APP_ADC_UART
        || settings.general.appToUse === AppUse.APP_ADC_PAS)
      && settings.general.canBaudRate === CANBaud.CAN_BAUD_500K
      && (settings.general.canMode === CANMode.CAN_MODE_COMM_BRIDGE || settings.general.canMode === CANMode.CAN_MODE_VESC)
      && settings.general.sendCanStatus === CANStatusMode.CAN_STATUS_1_2_3_4_5
      && (settings.general.controllerId === 22 || settings.general.controllerId === 23)
      && (settings.general.canStatusRateHz >= 5 && settings.general.canStatusRateHz <= 100);
  })
);

export const selectPIDParameters: OperatorFunction<IAppState, PIDParameter> = state$ => state$.pipe(
  select(selectDashboardState),
  map(dashboard => dashboard.pid)
);
export const selectADCEnabled: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectDashboardState),
  map(dashboard => dashboard.adcIsEnabled)
);
export const selectIsCurrentControl: OperatorFunction<IAppState, boolean> = state$ => state$.pipe(
  select(selectDashboardState),
  map(dashboard => dashboard.isCurrentControl)
);
