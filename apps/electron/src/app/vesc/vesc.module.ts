import { Module } from '@nestjs/common';
import { VESCController } from './controllers/vesc.controller';
import { VESCService } from './services/vesc.service';
import { SerialPortModule } from '../serial-port/serial-port.module';

@Module({
  controllers: [
    VESCController
  ],
  imports: [
    SerialPortModule
  ],
  providers: [
    VESCService
  ]
})
export class VESCModule {
}
