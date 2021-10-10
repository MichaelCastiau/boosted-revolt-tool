import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortInfo } from 'serialport';

@Injectable()
export class VESCService {
  constructor(private http: HttpClient) {
  }

  connect(): Observable<PortInfo> {
    return this.http.get<PortInfo>('/api/vesc/connect', {});
  }
}
