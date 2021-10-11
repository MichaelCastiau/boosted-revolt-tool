import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { PortInfo } from 'serialport';
import { IVESCInfo } from '../vesc-types';

export const connectToVESC = createAction('[VESC] Connect');
export const connectToVESCFail = createAction('[VESC] Connect Fail', props<{ error: HttpErrorResponse }>());
export const connectToVESCSuccess = createAction('[VESC] Connect Success', props<{ info: IVESCInfo }>());
