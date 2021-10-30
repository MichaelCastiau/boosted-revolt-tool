import { ConnectionMethod, IVESCAdapter } from './vesc.adapter';
import { BLEAdapter } from '../../ble/ble.adapter';
import { BLEWindowsAdapter } from '../../ble/ble.win.adapter';
import { SerialPortAdapter } from '../../serial-port/serial-port.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VescAdapterFactory {
  constructor(private bleAdapter: BLEAdapter,
              private bleWinAdapter: BLEWindowsAdapter,
              private serialAdapter: SerialPortAdapter) {
  }

  provideVESCAdapter(connectionMethod: ConnectionMethod): IVESCAdapter {
    switch (connectionMethod) {
      case 'ble':
        if (process.platform === 'win32') {
          console.warn('WARNING: providing Windows RT noble implementation');
          return this.bleWinAdapter;
        }
        return this.bleAdapter;
      case 'usb':
      default:
        return this.serialAdapter;
    }
  }
}
