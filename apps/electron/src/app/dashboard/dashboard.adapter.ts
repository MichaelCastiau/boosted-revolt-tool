import { Observable } from 'rxjs';

export interface IDashboardAdapter {
  /**
   * method returns true if the dashboard was detected
   * (most likely by messages over the CAN bus)
   */
  detect(): Promise<boolean>;

  getFirmwareVersion(): Observable<string>;
}
