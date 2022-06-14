import { IVESCAdapter } from './vesc.adapter';
import { SerialPortAdapter } from '../../serial-port/serial-port.adapter';
import { Injectable } from '@nestjs/common';
import { ConnectionMethod } from '@shared/types';

@Injectable()
export class VESCAdapterFactory {
  constructor(private serialAdapter: SerialPortAdapter) {
  }

  async provideVESCAdapter(connectionMethod: ConnectionMethod): Promise<IVESCAdapter> {
    switch (connectionMethod) {
      case 'usb':
      default:
        return this.serialAdapter;
    }
  }
}
