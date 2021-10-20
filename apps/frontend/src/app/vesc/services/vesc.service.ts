import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppData } from '../app-data';

@Injectable()
export class VESCService {

  constructor(private http: HttpClient) {
  }

  setBatteryConfiguration(configuration: number) {
    return this.http.post<void>('/api/vesc/battery', {
      configuration
    });
  }

  setMetricSystem({ system }) {
    return this.http.post('/api/vesc/metric-system', {
      system
    });
  }

  getAppSettings(): Observable<IAppData> {
    return this.http.get<IAppData>('/api/vesc/app-settings');
  }

  configureVESC(): Observable<IAppData> {
    return this.http.post<IAppData>('/api/vesc/configure', {});
  }
}
