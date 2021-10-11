import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortInfo } from 'serialport';
import { IVESCInfo } from '../vesc-types';

@Injectable()
export class VESCService {
  constructor(private http: HttpClient) {
  }

  connect(): Observable<IVESCInfo> {
    return this.http.get<IVESCInfo>('/api/vesc/connect', {});
  }
}
