import { Module } from '@nestjs/common';
import { VESCController } from './controllers/vesc.controller';
import { VESCService } from './services/vesc.service';
import { SerialPortModule } from '../serial-port/serial-port.module';
import { SocketGateway } from './gateways/socket.gateway';
import { SocketModule } from '@nestjs/websockets/socket-module';
import { SerialPortAdapter } from '../serial-port/serial-port.adapter';
import { BleAdapter } from '../ble/ble.adapter';
import { BleModule } from '../ble/ble.module';

@Module({
  controllers: [
    VESCController
  ],
  imports: [
    SerialPortModule,
    BleModule,
    SocketModule
  ],
  providers: [
    VESCService,
    SocketGateway,
    {
      provide: 'VESCAdapter',
      useClass: BleAdapter, //SerialPortAdapter
    }
  ]
})
export class VESCModule {
}
