import { Module } from '@nestjs/common';
import { VESCService } from './services/vesc.service';
import { SerialPortModule } from '../serial-port/serial-port.module';
import { SocketGateway } from './gateways/socket.gateway';
import { SocketModule } from '@nestjs/websockets/socket-module';
import { BleModule } from '../ble/ble.module';
import { VESCAdapterFactory } from './adapter/vesc-adapter.factory';

@Module({
  imports: [
    SerialPortModule,
    BleModule,
    SocketModule
  ],
  providers: [
    VESCService,
    SocketGateway,
    VESCAdapterFactory
  ],
  exports: [
    VESCService,
    SocketGateway
  ]
})
export class VESCModule {
}
