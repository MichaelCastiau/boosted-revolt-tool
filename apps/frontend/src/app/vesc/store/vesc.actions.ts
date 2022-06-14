import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IAppData } from '../app-data';
import { IVESCInfo } from './store';
import { PIDParameter } from '@shared/types';

export const connectToVESC = createAction('[VESC] Connect');
export const connectToVESCFail = createAction('[VESC] Connect Fail', props<{ error: HttpErrorResponse }>());
export const connectToVESCSuccess = createAction('[VESC] Connect Success', props<{ info: IVESCInfo }>());

export const connectToVESCViaUSB = createAction('[VESC] Connect USB');
export const disconnect = createAction('[VESC] disconnect');

export const connectionLost = createAction('[VESC] Connection lost', props<{ error?: Error }>());

export const setBatteryConfiguration = createAction('[Dashboard] Set battery configuration', props<{ configuration: number }>());
export const setBatteryConfigurationSuccess = createAction('[Dashboard] set battery configuration success', props<{ configuration: number }>());

export const setMetricSystem = createAction('[Dashboard] Set metric system', props<{ system: 'kmh' | 'mph' }>());
export const setMetricSystemSuccess = createAction('[Dashboard] Set metric system success', props<{ system: 'kmh' | 'mph' }>());

export const setWheelCircumference = createAction('[Dashboard] Set wheel circumference', props<{ circumferenceMM: number }>());
export const setWheelCircumferenceSuccess = createAction('[Dashboard] Set wheel circumference success', props<{ circumferenceMM: number }>());

export const setUseADCThrottle = createAction('[Dashboard] set use ADC throttle', props<{ useADCThrottle: boolean }>());
export const setUseADCThrottleSuccess = createAction('[Dashboard] set use ADC throttle success', props<{useADCThrottle: boolean}>());

export const setUseCurrentControl = createAction('[Dashboard] set use current control', props<{ useCurrentControl: boolean }>());
export const setUseCurrentControlSuccess = createAction('[Dashboard] set use current control success', props<{useCurrentControl: boolean}>());

export const setPID = createAction('[Dashboard] set PID parameters', props<{ pid: PIDParameter }>());
export const setPIDSuccess = createAction('[Dashboard] set PID parameters success', props<{ pid: PIDParameter }>());

export const configuringDashboardError = createAction('[Dashboard] configuring dashboard error', props<{ error: HttpErrorResponse | Error }>());

export const getAppSettings = createAction('[VESC] Get app settings');
export const getAppSettingsFail = createAction('[VESC] Get app settings fail', props<{ error: HttpErrorResponse }>());
export const getAppSettingsSuccess = createAction('[VESC] Get app settings success', props<{ appSettings: IAppData }>());

export const configureVESC = createAction('[VESC] Configure');
export const configureVESCSuccess = createAction('[VESC] Configure Success', props<{ appSettings: IAppData }>());
export const configureVESCFail = createAction('[VESC] Configure fail', props<{ error: HttpErrorResponse }>());
