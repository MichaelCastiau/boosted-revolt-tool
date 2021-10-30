import { Subject } from 'rxjs';

export interface IVESCAdapter {
  isConnected(): boolean;

  connect(): Promise<Subject<Buffer>>;

  disconnect(): Promise<void>;
}

export type ConnectionMethod = 'usb' | 'ble';
