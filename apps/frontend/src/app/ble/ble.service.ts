import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BLEService {
  constructor(private http: HttpClient) {
  }

  stopScanning(): Observable<void> {
    return this.http.get<void>('http://localhost:3333/api/ble/stop');
  }
}
