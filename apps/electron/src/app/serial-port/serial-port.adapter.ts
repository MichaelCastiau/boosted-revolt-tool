import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { SerialPortService } from './serial-port.service';
import { PortNotFoundException } from '../exceptions/port-not-found.exception';
import { Subject } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SerialPortAdapter implements IVESCAdapter {
  constructor(private serial: SerialPortService) {
  }

  async connect(): Promise<Subject<Buffer>> {
    const port = await this.serial.findVESCPort();
    if (!port) {
      throw new PortNotFoundException();
    }
    return this.serial.openPort(port);
  }

  isConnected(): boolean {
    return this.serial.isConnected();
  }

}
