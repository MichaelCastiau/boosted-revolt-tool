import { createFeatureSelector } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { PortInfo } from 'serialport';
import { IDashboardConfig, IVESCInfo } from '../vesc-types';

export interface IVESCState {
  isConnecting?: boolean;
  errorConnecting?: HttpErrorResponse;
  isConnected: boolean;
  vescInfo?: IVESCInfo;
  dashboardConfig?: IDashboardConfig;
}

export const selectVESCState = createFeatureSelector<IVESCState>('vesc');
