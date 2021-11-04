import { Module } from '@nestjs/common';
import { RevoltDashboardService } from './revolt-dashboard.service';
import { DashboardController } from './dashboard.controller';
import { VESCModule } from '../vesc/vesc.module';

@Module({
  controllers: [
    DashboardController
  ],
  providers: [
    RevoltDashboardService
  ],
  imports: [
    VESCModule
  ]
})
export class ReVOLTDashboardModule {
}
