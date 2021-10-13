import { IAppData } from './app-data';

export interface IVESCInfo {
  version: string;
  name: string;
  app?: IAppData
}

export interface IDashboardConfig {
  batteryConfiguration?: number;
  metricSystem?: 'kmh' | 'mph';
}
