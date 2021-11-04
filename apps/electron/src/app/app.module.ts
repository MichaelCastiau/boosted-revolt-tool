import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReVOLTDashboardModule } from './dashboard/dashboard.module';
import { VescFacadeModule } from './vesc-facade/vesc-facade.module';

@Module({
  imports: [
    VescFacadeModule,
    ReVOLTDashboardModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
