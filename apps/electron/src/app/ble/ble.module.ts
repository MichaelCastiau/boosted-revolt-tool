import { Module } from '@nestjs/common';
import { BLEAdapter } from './ble.adapter';
import { BLEService } from './ble.service';
import { BLEWindowsAdapter } from './ble.win.adapter';
import { BLEWindowsService } from './ble-win.service';

@Module({
  providers: [
    BLEAdapter,
    BLEService,
    BLEWindowsAdapter,
    BLEWindowsService
  ],
  exports: [
    BLEAdapter,
    BLEService,
    BLEWindowsAdapter,
    BLEWindowsService
  ]
})
export class BleModule {

}
