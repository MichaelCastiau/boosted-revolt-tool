export interface IVESCInfo {
  version: string;
  name: string;
}

export interface IDashboardConfig {
  batteryConfiguration?: number;
  metricSystem?: 'kmh' | 'mph';
}
