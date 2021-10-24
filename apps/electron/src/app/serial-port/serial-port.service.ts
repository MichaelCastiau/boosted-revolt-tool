import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { serialPortToken } from './serial-port.provider';
import * as SerialPort from 'serialport';
import { PortInfo } from 'serialport';
import { Observable, Observer, Subject } from 'rxjs';
import { crc16xmodem } from 'crc';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { filter, map, scan, share, skipWhile } from 'rxjs/operators';

@Injectable()
export class SerialPortService {
  private port: SerialPort;

  public static readonly STOP_BYTE = 3;
  public static readonly SHORT_PACKET = 2;
  public static readonly LONG_PACKET = 3;

  constructor(@Inject(serialPortToken) private serial,
              private eventEmitter: EventEmitter2) {
  }

  async findVESCPort(): Promise<PortInfo> {
    const ports = await this.serial.list();
    return (ports || []).find((port: PortInfo) => port.vendorId === '0483' && port.productId === '5740');
  }

  async openPort(info: PortInfo): Promise<Subject<Buffer>> {
    if (this.port && this.port.isOpen) {
      await this.port.close();
    }
    this.port = new SerialPort(info.path, {
      baudRate: 115200,
      dataBits: 8,
      parity: 'none',
      stopBits: 1
    });


    return new Promise<Subject<Buffer>>(async (resolve, reject) => {
      const observable = new Observable<Buffer>((observer: Observer<Buffer>) => {
        this.port.on('data', data => {
          observer.next(data);
        });
        this.port.on('error', error => {
          reject(error);
          observer.error(error);
        });
        this.port.on('close', () => {
          console.log('Serial port closed');
          this.eventEmitter.emit('serial:closed');
          observer.complete();
        });
      });

      this.port.on('open', () => {
        console.log('openened');
        resolve(new AnonymousSubject({
          error: (error) => {
            console.error(error);
            this.port?.close();
          },
          complete: () => {
            this.port?.close();
          },
          next: async (data: Buffer) => {
            await this.write(data);
          }
        }, observable.pipe(
          filter(b => !!b),
          scan((acc: Buffer, current: Buffer) => Buffer.from([...acc, ...current])),
          filter(buffer => {
            return buffer.length > 6;
          }),
          skipWhile(buffer => {
            if (buffer.length < 5)
              return true;

            if (buffer.length === 5)
              return false;

            return (buffer.readUInt8(0) === SerialPortService.SHORT_PACKET && buffer.length < (buffer.readUInt8(1) + 5))
              || (buffer.readUInt8(0) === SerialPortService.LONG_PACKET && buffer.length < (buffer.readUInt16BE(1) + 6));
          }),
          map(buffer => buffer.readUInt8(0) === SerialPortService.SHORT_PACKET ? buffer.slice(2) : buffer.slice(3)),
          share()
        )));
      });
    });
  }

  private async write(payload: Buffer = Buffer.alloc(0)): Promise<void> {
    if (!this.port || !this.port.isOpen) {
      throw new BadRequestException('Cannot write to serial port, port not open');
    }
    const crcByte = crc16xmodem(Buffer.from([...payload]));
    const lengthBytes = payload.length > 255 ? Buffer.alloc(2)
      : Buffer.alloc(1);
    payload.length > 255 ? lengthBytes.writeUInt16BE(payload.length) : lengthBytes.writeUInt8(payload.length);
    const data = Buffer.from([
      payload.length > 255 ? SerialPortService.LONG_PACKET : SerialPortService.SHORT_PACKET,
      ...lengthBytes,
      ...payload,
      (crcByte) >> 8,
      (crcByte) & 0xff,
      SerialPortService.STOP_BYTE
    ]);
    await new Promise<void>((resolve, reject) => this.port.write(data, (err?) => err ? reject(err) : resolve()));
  }

  isConnected() {
    return this.port && this.port.isOpen;
  }
}
