import { SerialPortService } from '../../serial-port/serial-port.service';
import { Injectable } from '@nestjs/common';
import { PortNotFoundException } from '../../exceptions/port-not-found.exception';
import { IVESCFirmwareInfo, VESCCommands } from '../models/commands';
import { filter, first, map, share, tap, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class VESCService {

  private socket: Observable<Buffer>;

  constructor(private serial: SerialPortService) {
  }

  async connect() {
    if (!this.serial.isConnected()) {
      // First find the port the vesc is connected to
      const port = await this.serial.findVESCPort();
      if (!port) {
        throw new PortNotFoundException();
      }
      this.socket = await this.serial.openPort(port);
    }
    //Now get the firmware version
    return this.getFirmwareVersion().toPromise();
  }

  getFirmwareVersion(): Observable<IVESCFirmwareInfo> {
    const data = Buffer.from([VESCCommands.COMM_FW_VERSION]);
    this.serial.write(data);
    return this.socket.pipe(
      filter(data => data.readInt8(0) === VESCCommands.COMM_FW_VERSION),
      first(),
      map(data => data.slice(1, data.length - 1)),
      map(data => {
        return {
          version: `${data.readInt8(0)}.${data.readInt8(1)}`,
          name: Buffer.from(data.slice(2, 14)).toString('utf-8')
        };
      }),
      timeout(500),
      tap(console.log),
    );
  }
}
