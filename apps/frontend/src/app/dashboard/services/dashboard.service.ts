import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {
  }

  getFirmwareVersion(): Observable<string> {
    return this.http.get<string>('http://localhost:3333/api/dashboard/firmware-version');
  }
}
