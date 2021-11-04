import { Controller, Get } from '@nestjs/common';
import { RevoltDashboardService } from './revolt-dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboard: RevoltDashboardService) {
  }

  @Get('firmware-version')
  getFirmwareVersion() {
    return this.dashboard.getFirmwareVersion();
  }
}
