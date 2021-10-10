import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SerialPortModule } from './serial-port/serial-port.module';
import { VESCModule } from './vesc/vesc.module';

@Module({
  imports: [SerialPortModule, VESCModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
