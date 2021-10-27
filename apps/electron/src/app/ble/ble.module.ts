import { Module } from '@nestjs/common';
import { BleAdapter } from './ble.adapter';
import { nobleProvider } from './noble.provider';
import { BLEService } from './ble.service';

@Module({
  providers: [
    BleAdapter,
    nobleProvider,
    BLEService
  ],
  exports: [
    BleAdapter,
    BLEService
  ]
})
export class BleModule {

}
