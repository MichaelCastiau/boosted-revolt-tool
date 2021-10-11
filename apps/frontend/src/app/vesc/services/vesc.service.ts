import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVESCInfo } from '../vesc-types';

@Injectable()
export class VESCService {
  constructor(private http: HttpClient) {
  }

  connect(): Observable<IVESCInfo> {
    return this.http.get<IVESCInfo>('/api/vesc/connect', {});
  }

  setBatteryConfiguration(configuration: number) {
    return this.http.post<void>('/api/vesc/battery', {
      configuration
    });
  }
}
