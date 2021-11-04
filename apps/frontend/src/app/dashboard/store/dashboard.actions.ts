import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export const getDashboardFirmwareVersion = createAction('[Dashboard] get dashboard version');
export const getDashboardFirmwareVersionSuccess = createAction('[Dashboard] get dashboard version success', props<{ version: string }>());
export const getDashboardFirmwareVersionFail = createAction('[Dashboard] get dashboard version fail', props<{ error: HttpErrorResponse }>());
