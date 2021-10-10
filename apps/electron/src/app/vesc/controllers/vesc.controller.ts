import { Controller, Get } from '@nestjs/common';
import { VESCService } from '../services/vesc.service';
import { PortInfo } from 'serialport';

@Controller('vesc')
export class VESCController {
  constructor(private vesc: VESCService) {
  }

  @Get('connect')
  connectToVESC(): Promise<PortInfo> {
    return this.vesc.connect();
  }
}
