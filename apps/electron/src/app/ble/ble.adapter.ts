import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { BLEService } from './ble.service';

@Injectable()
export class BleAdapter implements IVESCAdapter {
  constructor(private ble: BLEService) {
  }

  isConnected(): boolean {
    return false;
  }

  async connect(): Promise<Subject<Buffer>> {
    const device = await this.ble.findDevice();
    return this.ble.connect(device);
  }

  disconnect(): Promise<void> {
    return Promise.resolve(undefined);
  }

}
