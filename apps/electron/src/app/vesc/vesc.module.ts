import { Module } from '@nestjs/common';
import { VESCController } from './controllers/vesc.controller';
import { VESCService } from './services/vesc.service';
import { SerialPortModule } from '../serial-port/serial-port.module';
import { SocketGateway } from './gateways/socket.gateway';
import { SocketModule } from '@nestjs/websockets/socket-module';
import { VESCAdapterFactory } from './adapter/vesc-adapter.factory';

@Module({
  controllers: [
    VESCController
  ],
  imports: [
    SerialPortModule,
    SocketModule
  ],
  providers: [
    VESCService,
    SocketGateway,
    VESCAdapterFactory
  ]
})
export class VESCModule {
}
