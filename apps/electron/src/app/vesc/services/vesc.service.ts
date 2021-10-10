import { SerialPortService } from '../../serial-port/serial-port.service';
import { Injectable } from '@nestjs/common';
import { PortNotFoundException } from '../../exceptions/port-not-found.exception';
import { PortInfo } from 'serialport';

@Injectable()
export class VESCService {
  constructor(private serial: SerialPortService) {
  }

  async connect(): Promise<PortInfo> {
    // First find the port the vesc is connected to
    const port = await this.serial.findVESCPort();
    if (!port) {
      throw new PortNotFoundException();
    }
    return port;
  }
}
