import {Module} from '@nestjs/common';
import {SerialPortService} from './serial-port.service';
import {serialPortProvider} from './serial-port.provider';

@Module({
  providers: [
    SerialPortService,
    serialPortProvider
  ],
  exports: [
    SerialPortService
  ]
})
export class SerialPortModule {

}
