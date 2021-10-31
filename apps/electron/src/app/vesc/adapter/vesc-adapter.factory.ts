import { IVESCAdapter } from './vesc.adapter';
import { SerialPortAdapter } from '../../serial-port/serial-port.adapter';
import { Injectable } from '@nestjs/common';
import { ConnectionMethod } from '@shared/types';
import { BLEAdapter } from '../../ble/ble.adapter';

@Injectable()
export class VESCAdapterFactory {
  constructor(private bleAdapter: BLEAdapter,
              private serialAdapter: SerialPortAdapter) {
  }

  async provideVESCAdapter(connectionMethod: ConnectionMethod): Promise<IVESCAdapter> {
    switch (connectionMethod) {
      case 'ble':
        return this.bleAdapter;
      case 'usb':
      default:
        return this.serialAdapter;
    }
  }
}
