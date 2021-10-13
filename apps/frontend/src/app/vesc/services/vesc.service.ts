import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  getAppSettings() {
    return this.http.get('/api/vesc/app-settings');
  }
}
