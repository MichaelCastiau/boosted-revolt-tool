import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IVESCInfo } from '../vesc-types';

export const connectToVESC = createAction('[VESC] Connect');
export const connectToVESCFail = createAction('[VESC] Connect Fail', props<{ error: HttpErrorResponse }>());
export const connectToVESCSuccess = createAction('[VESC] Connect Success', props<{ info: IVESCInfo }>());

export const setBatteryConfiguration = createAction('[Dashboard] Set battery configuration', props<{ configuration: number }>());
export const setBatteryConfigurationSuccess = createAction('[Dashboard] set battery configuration success', props<{ configuration: number }>());

export const setMetricSystem = createAction('[Dashboard] Set metric system', props<{ system: 'kmh' | 'mph' }>());
export const setMetricSystemSuccess = createAction('[Dashboard] Set metric system success', props<{ system: 'kmh' | 'mph' }>());
