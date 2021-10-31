import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VESCModule } from './vesc/vesc.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    VESCModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
