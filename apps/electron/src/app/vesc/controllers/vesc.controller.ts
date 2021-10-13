import { Body, Controller, Get, Post } from '@nestjs/common';
import { VESCService } from '../services/vesc.service';
import { CanMessageDto, MetricSystemDto } from '../dto/can-message.dto';
import { environment } from '../../../environments/environment';

@Controller('vesc')
export class VESCController {
  constructor(private vesc: VESCService) {
  }

  @Get('app-settings')
  getAppSettings(){
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
}
