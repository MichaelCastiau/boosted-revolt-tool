import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { SerialPortService } from './serial-port.service';
import { PortNotFoundException } from '../exceptions/port-not-found.exception';
import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { Peripheral } from 'noble';

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

  disconnect(): Promise<void> {
    return this.serial.disconnect();
  }

  searchForDevices(): Observable<Peripheral> {
    return of(null);
  }

  stopSearching(): Promise<void> {
    return Promise.resolve(undefined);
  }

}
