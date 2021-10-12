import { Module } from '@nestjs/common';
import { VESCController } from './controllers/vesc.controller';
import { VESCService } from './services/vesc.service';
import { SerialPortModule } from '../serial-port/serial-port.module';
import { SocketGateway } from './gateways/socket.gateway';
import { SocketModule } from '@nestjs/websockets/socket-module';

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
    SocketGateway
  ]
})
export class VESCModule {
}
