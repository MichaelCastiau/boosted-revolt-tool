import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BLEController } from './ble.controller';
import { BLEAdapter } from './ble.adapter';
import { BLEService } from './ble.service';

@Module({
  imports: [EventEmitterModule],
  providers: [
    BLEAdapter,
    BLEService
  ],
  controllers: [BLEController],
  exports: [BLEAdapter]
})
export class BleModule {
}
