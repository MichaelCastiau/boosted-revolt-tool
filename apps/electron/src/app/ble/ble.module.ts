import { DynamicModule, Module } from '@nestjs/common';
import { PROVIDE_BLE_ADAPTER, PROVIDE_BLE_SERVICE } from './ble.providers';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule]
})
export class BleModule {
  static forUnix(): DynamicModule {
    const adapter = import('./ble.adapter').then(m => m.BLEAdapter);
    const service = import('./ble.service').then(m => m.BLEService);
    return {
      module: BleModule,
      providers: [
        {
          inject: [PROVIDE_BLE_SERVICE],
          provide: PROVIDE_BLE_ADAPTER,
          useFactory: async (service) => await adapter.then(adapter => new adapter(service))
        },
        {
          inject: [EventEmitter2],
          provide: PROVIDE_BLE_SERVICE,
          useFactory: async (eventEmitter: EventEmitter2) => await service.then(service => new service(eventEmitter))
        }
      ],
      exports: [PROVIDE_BLE_SERVICE, PROVIDE_BLE_ADAPTER]
    };
  }

  static forWindows(): DynamicModule {
    const adapter = import('./ble.win.adapter').then(m => m.BLEWindowsAdapter);
    const service = import('./ble-win.service').then(m => m.BLEWindowsService);
    return {
      module: BleModule,
      providers: [
        {
          inject: [PROVIDE_BLE_SERVICE],
          provide: PROVIDE_BLE_ADAPTER,
          useFactory: async (service) => await adapter.then(adapter => new adapter(service))
        },
        {
          inject: [EventEmitter2],
          provide: PROVIDE_BLE_SERVICE,
          useFactory: async (eventEmitter: EventEmitter2) => await service.then(service => new service(eventEmitter))
        }
      ],
      exports: [PROVIDE_BLE_SERVICE, PROVIDE_BLE_ADAPTER]
    };
  }
}
