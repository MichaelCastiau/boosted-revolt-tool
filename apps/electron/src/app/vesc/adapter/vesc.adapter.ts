import { Observable, Subject } from 'rxjs';
import { Peripheral } from 'noble';

export interface IVESCAdapter {
  isConnected(): boolean;

  connect(): Promise<Subject<Buffer>>;

  disconnect(): Promise<void>;

  searchForDevices(): Observable<Peripheral>;
}

export type ConnectionMethod = 'usb' | 'ble';
