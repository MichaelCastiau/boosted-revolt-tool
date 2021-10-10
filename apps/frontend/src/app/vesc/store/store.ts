import { createFeatureSelector } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { PortInfo } from 'serialport';

export interface IVESCState {
  isConnecting?: boolean;
  errorConnecting?: HttpErrorResponse;
  portInfo?: PortInfo
}

export const selectVESCState = createFeatureSelector<IVESCState>('vesc');
