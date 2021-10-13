import { IVESCState } from '../vesc/store/store';
import { IDashboardState } from '../dashboard/store/store';

export interface IAppState {
  vesc: IVESCState;
  dashboard: IDashboardState
}
