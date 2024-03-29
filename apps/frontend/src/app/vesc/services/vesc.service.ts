import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppData } from '../app-data';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class VESCService {

  constructor(private http: HttpClient) {
  }

  setBatteryConfiguration(configuration: number) {
    return this.http.post<void>('http://localhost:3333/api/vesc/battery', {
      configuration
    });
  }

  setMetricSystem({ system }) {
    return this.http.post('http://localhost:3333/api/vesc/metric-system', {
      system
    });
  }

  setWheelCircumference(circumference: number) {
    return this.http.post('http://localhost:3333/api/vesc/wheel-circumference', {
      circumference
    });
  }

  getAppSettings(): Observable<IAppData> {
    return this.http.get<IAppData>('http://localhost:3333/api/vesc/app-settings');
  }

  configureVESC(): Observable<IAppData> {
    return this.http.post<void>('http://localhost:3333/api/vesc/configure', {}).pipe(
      switchMap(() => this.getAppSettings())
    );
  }

  disconnect() {
    return this.http.get('/api/ble/disconnect');
  }
}
