import { SerialPortService } from '../../serial-port/serial-port.service';
import { Injectable } from '@nestjs/common';
import { PortNotFoundException } from '../../exceptions/port-not-found.exception';
import { IVESCFirmwareInfo, VESCCommands } from '../models/datatypes';
import { filter, first, map, scan, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { doOnSubscribe } from '../../helpers/onsubscribe.helper';
import { deserializeAppData } from '../../helpers/serializer.helper';

@Injectable()
export class VESCService {

  private socket: Subject<Buffer>;

  constructor(private serial: SerialPortService) {
  }

  async connect(): Promise<Observable<any>> {
    if (!this.serial.isConnected()) {
      // First find the port the vesc is connected to
      const port = await this.serial.findVESCPort();
      if (!port) {
        throw new PortNotFoundException();
      }
      this.socket = await this.serial.openPort(port);
    }

    return this.socket;
  }

  getFirmwareVersion(): Observable<IVESCFirmwareInfo> {
    return this.socket.pipe(
      filter((data: Buffer) => data && data.length > 3),
      filter(data => data?.readUInt8(2) === VESCCommands.COMM_FW_VERSION),
      first(),
      map(data => data.slice(3)),
      map(data => {
        return {
          version: `${data.readUInt8(0)}.${data.readUInt8(1)}`,
          name: Buffer.from(data.slice(2, 14)).toString('utf-8')
        };
      }),
      doOnSubscribe(() => this.socket.next(Buffer.from([VESCCommands.COMM_FW_VERSION])))
    );
  }

  async forwardCANMessage(config: {
    extendedId: number,
    data: Buffer
  }) {
    /*
    CAN COMMAND,
    extended id (4 bytes)
    is extended? (1 byte)
     */
    const command = Buffer.from([0, 0, 0, environment.CAN.extendedId, 1, ...config.data]);
    return this.socket.next(Buffer.from([VESCCommands.COMM_CAN_FWD_FRAME, ...command]));
  }

  getAppSettings() {
    return this.socket.pipe(
      doOnSubscribe(() => this.socket.next(Buffer.from([VESCCommands.COMM_GET_APPCONF]))),
      filter(b => !!b),
      scan((acc, current) => {
        return Buffer.concat([acc, current]);
      }, Buffer.from([])),
      filter((buffer) => {
        const totalNumberOfBytes = buffer.readUInt16BE(1);
        return buffer.length === (totalNumberOfBytes + 6);
      }),
      first(),
      map(buffer => deserializeAppData(buffer)),
      tap(console.log)
    );
  }
}
