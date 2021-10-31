import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { Observable, Subject } from 'rxjs';
import { Peripheral } from 'noble';
import { Injectable } from '@nestjs/common';
import { BLEWindowsService } from './ble-win.service';

@Injectable()
export class BLEWindowsAdapter implements IVESCAdapter {
  constructor(private ble: BLEWindowsService) {
  }

  isConnected(): boolean {
    return false;
  }

  async connect(): Promise<Subject<Buffer>> {
    const device: Peripheral = await this.ble.findDevice();
    try {
      return await this.ble.connect(device);
    } catch (error) {
      await this.ble.disconnect();
      throw error;
    }
  }

  disconnect(): Promise<void> {
    return this.ble.disconnect();
  }

  searchForDevices(): Observable<Peripheral> {
    return undefined;
  }

  stopSearching(): Promise<void> {
    return Promise.resolve(undefined);
  }

}
