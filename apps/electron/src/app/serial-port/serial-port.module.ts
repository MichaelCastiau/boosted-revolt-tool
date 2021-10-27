import { Module } from '@nestjs/common';
import { SerialPortService } from './serial-port.service';
import { serialPortProvider } from './serial-port.provider';
import { SerialPortAdapter } from './serial-port.adapter';

@Module({
  providers: [
    SerialPortService,
    serialPortProvider,
    SerialPortAdapter
  ],
  exports: [
    SerialPortAdapter,
    SerialPortService
  ]
})
export class SerialPortModule {

}
