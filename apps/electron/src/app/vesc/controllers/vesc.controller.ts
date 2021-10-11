import { Body, Controller, Get, Post } from '@nestjs/common';
import { VESCService } from '../services/vesc.service';
import { CanMessageDto } from '../dto/can-message.dto';
import { environment } from '../../../environments/environment';

@Controller('vesc')
export class VESCController {
  constructor(private vesc: VESCService) {
  }

  @Get('connect')
  async connectToVESC() {
    return this.vesc.connect();
  }

  @Post('battery')
  forwardCANMessage(@Body() body: CanMessageDto) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([4, body.configuration])
    });
  }
}
