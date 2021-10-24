import { createFeatureSelector } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { IAppData } from '../app-data';

export interface IVESCState {
  isConnecting?: boolean;
  errorConnecting?: HttpErrorResponse | Error;
  isConnected: boolean;
  VESCInfo?: IVESCInfo;
  dashboardConfig?: IDashboardConfig;
  errorConfiguringDashboard?: Error | HttpErrorResponse;
  writingAppSettings?: boolean;
  errorConfiguringVESC?: HttpErrorResponse;
}

export interface IVESCInfo {
  version: string;
  name: string;
  app?: IAppData
}

export interface IDashboardConfig {
  batteryConfiguration?: number;
  metricSystem?: 'kmh' | 'mph';
}

export const selectVESCState = createFeatureSelector<IVESCState>('vesc');
