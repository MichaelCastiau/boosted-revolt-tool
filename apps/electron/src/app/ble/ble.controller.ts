import { Controller, Get, Inject } from '@nestjs/common';
import { PROVIDE_BLE_ADAPTER } from './ble.providers';
import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';

@Controller('ble')
export class BLEController {
  constructor(@Inject(PROVIDE_BLE_ADAPTER) private ble: IVESCAdapter) {
  }

  @Get('stop')
  stopScanning() {
    return this.ble.stopSearching();
  }

  @Get('disconnect')
  disconnect() {
    return this.ble.disconnect();
  }
}
