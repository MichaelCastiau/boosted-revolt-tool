import { Inject, Injectable } from '@nestjs/common';
import { serialPortToken } from './serial-port.provider';
import { PortInfo } from 'serialport';

@Injectable()
export class SerialPortService {
  constructor(@Inject(serialPortToken) private serial) {
  }

  async findVESCPort(): Promise<PortInfo> {
    const ports = await this.serial.list();
    return (ports || []).find((port: PortInfo) => port.vendorId === '0483' && port.productId === '5740');
  }
}
