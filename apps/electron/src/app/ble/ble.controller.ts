import { Controller, Get } from '@nestjs/common';
import { BLEAdapter } from './ble.adapter';

@Controller('ble')
export class BLEController {
  constructor(private ble: BLEAdapter) {
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
