import { Observable, Subject } from 'rxjs';
import { Peripheral } from 'noble';

export interface IVESCAdapter {
  isConnected(): boolean;

  connect(deviceId?: string): Promise<Subject<Buffer>>;

  disconnect(): Promise<void>;

  searchForDevices(): Observable<Peripheral>;

  stopSearching(): Promise<void>;
}
