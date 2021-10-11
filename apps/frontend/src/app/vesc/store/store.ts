import { createFeatureSelector } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { PortInfo } from 'serialport';
import { IVESCInfo } from '../vesc-types';

export interface IVESCState {
  isConnecting?: boolean;
  errorConnecting?: HttpErrorResponse;
  isConnected: boolean;
  portInfo?: IVESCInfo
}

export const selectVESCState = createFeatureSelector<IVESCState>('vesc');
