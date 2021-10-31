import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { BLEService } from './ble.service';
import { Peripheral } from '@abandonware/noble';

@Injectable()
export class BLEAdapter implements IVESCAdapter {

  constructor(private ble: BLEService) {
  }

  isConnected(): boolean {
    return this.ble.isConnected();
  }

  async connect(deviceId?: string): Promise<Subject<Buffer>> {
    const device: Peripheral = await this.ble.findDevice(deviceId);
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
    return this.ble.startScanningAndFindDevice();
  }

  stopSearching(): Promise<void> {
    return this.ble.stopScanning();
  }
}
