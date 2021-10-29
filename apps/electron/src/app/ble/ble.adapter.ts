import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { BLEService } from './ble.service';
import { Peripheral } from '@abandonware/noble';

@Injectable()
export class BleAdapter implements IVESCAdapter {

  constructor(private ble: BLEService) {
  }

  isConnected(): boolean {
    return false;
  }

  async connect(): Promise<Subject<Buffer>> {
    const device: Peripheral = await this.ble.findDevice();
    try {
      return await this.ble.connect(device);
    } catch (error) {
      await device.disconnectAsync();
      throw error;
    }
  }

  disconnect(): Promise<void> {
    return this.ble.disconnect();
  }

}
