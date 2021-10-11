import { Controller, Get } from '@nestjs/common';
import { VESCService } from '../services/vesc.service';

@Controller('vesc')
export class VESCController {
  constructor(private vesc: VESCService) {
  }

  @Get('connect')
  async connectToVESC() {
    return this.vesc.connect();
  }
}
