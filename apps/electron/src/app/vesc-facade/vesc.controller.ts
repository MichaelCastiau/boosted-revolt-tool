import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { VESCService } from '../vesc/services/vesc.service';
import { CanMessageDto, MetricSystemDto } from './dto/can-message.dto';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IAppData } from '../vesc/models/app-data';

@Controller('vesc')
export class VESCController {
  constructor(@Inject(VESCService) private vesc: VESCService) {
  }

  @Get('app-settings')
  getAppSettings() {
    return this.vesc.getAppSettings();
  }

  @Post('battery')
  forwardCANMessage(@Body() body: CanMessageDto) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([4, body.configuration])
    });
  }

  @Post('metric-system')
  setMetricSystem(@Body() body: MetricSystemDto) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([body.system === 'kmh' ? 2 : 1])
    });
  }

  @Post('/configure')
  configureAutomatically(): Observable<IAppData> {
    return this.vesc.configureForDashboard();
  }
}
