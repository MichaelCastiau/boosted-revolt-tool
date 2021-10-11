import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { serialPortToken } from './serial-port.provider';
import * as SerialPort from 'serialport';
import { PortInfo } from 'serialport';
import { Observable, Subject } from 'rxjs';
import { crc16xmodem } from 'crc';

@Injectable()
export class SerialPortService {
  private port: SerialPort;
  private socket: Subject<Buffer> = new Subject();

  public static readonly STOP_BYTE = 3;
  public static readonly SHORT_PACKET = 2;
  public static readonly LONG_PACKET = 3;

  constructor(@Inject(serialPortToken) private serial) {
  }

  async findVESCPort(): Promise<PortInfo> {
    const ports = await this.serial.list();
    return (ports || []).find((port: PortInfo) => port.vendorId === '0483' && port.productId === '5740');
  }

  async openPort(info: PortInfo): Promise<Observable<Buffer>> {
    if (this.port && this.port.isOpen) {
      await this.port.close();
    }
    this.port = new SerialPort(info.path, {
      baudRate: 115200,
      dataBits: 8,
      parity: 'none',
      stopBits: 1
    });

    return new Promise<Observable<Buffer>>(async (resolve, reject) => {
      this.port.on('open', async () => {

        this.port.on('data', data => {
          console.log(data);
          this.socket.next(this.parseResponse(data));
        });
        this.port.on('error', error => this.socket.error(error));
        this.port.on('close', () => this.socket.complete());

        console.log('Serial port opened');
        resolve(this.socket);
      });
      this.port.on('error', reject);
    });
  }

  async write(command: number, payload: Buffer = Buffer.alloc(0)): Promise<void> {
    if (!this.port || !this.port.isOpen) {
      throw new BadRequestException('Cannot write to serial port, port not open');
    }
    console.log(payload);
    const crcByte = crc16xmodem(Buffer.from([command, ...payload]));
    const data = Buffer.from([
      SerialPortService.SHORT_PACKET,
      payload.length + 1,
      command,
      ...payload,
      (crcByte) >> 8,
      (crcByte) & 0xff,
      SerialPortService.STOP_BYTE
    ]);
    console.log('writing', data);
    await new Promise<void>((resolve, reject) => this.port.write(data, (err?) => err ? reject(err) : resolve()));
  }

  parseResponse(data: Buffer): Buffer {
    switch (data.readInt8(0)) {
      case SerialPortService.SHORT_PACKET:
        return data.slice(2, 2 + data.readInt8(1));
      case SerialPortService.LONG_PACKET:
        return data.slice(3, 3 + data.readInt16LE(1));
    }
  }

  isConnected() {
    return this.port && this.port.isOpen;
  }
}
