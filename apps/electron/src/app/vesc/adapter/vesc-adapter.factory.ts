import { IVESCAdapter } from './vesc.adapter';
import { SerialPortAdapter } from '../../serial-port/serial-port.adapter';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDE_BLE_ADAPTER } from '../../ble/ble.providers';
import { ConnectionMethod } from '@shared/types';

@Injectable()
export class VESCAdapterFactory {
  constructor(@Inject(PROVIDE_BLE_ADAPTER) private bleAdapter: IVESCAdapter,
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
