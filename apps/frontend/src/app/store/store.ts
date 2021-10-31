import { IVESCState } from '../vesc/store/store';
import { IDashboardState } from '../dashboard/store/store';
import { IBLEState } from '../ble/store/ble.store';

export interface IAppState {
  vesc: IVESCState;
  dashboard: IDashboardState;
  ble: IBLEState;
}
