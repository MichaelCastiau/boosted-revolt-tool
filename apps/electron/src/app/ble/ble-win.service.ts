import { Injectable, NotFoundException } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';
import * as noble from 'noble-winrt';
import { Characteristic, Peripheral } from 'noble';
import { catchError, first, tap, timeout } from 'rxjs/operators';
import { doOnSubscribe } from '../helpers/onsubscribe.helper';
import { environment } from '../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { deserializeResponse, serializeCommandBuffer } from '../helpers/serializer.helper';

@Injectable()
export class BLEWindowsService {
  private device: Peripheral;

  constructor(private eventEmitter: EventEmitter2) {
  }

  async findDevice(): Promise<Peripheral> {
    const device = await this.startScanningAndFindDevice();
    if (!device) {
      throw new NotFoundException('BLE VESC Device not found or timeout reached');
    }
    return device;
  }

  async connect(device: Peripheral) {
    this.device = device;
    await new Promise<void>((resolve, reject) => device.connect(err => err ? reject(err) : resolve()));

    console.info('Device connected through BLE');

    const [rxCharacteristic, txCharacteristic] = await new Promise<Characteristic[]>((resolve, reject) => device.discoverSomeServicesAndCharacteristics([
      environment.BLE.service.uuid
    ], [
      environment.BLE.service.characteristics.tx,
      environment.BLE.service.characteristics.rx
    ], (err, services, characteristics) => {
      err ? reject(err) : resolve([
        characteristics.find(c => c.uuid === environment.BLE.service.characteristics.rx),
        characteristics.find(c => c.uuid === environment.BLE.service.characteristics.tx)
      ]);
    }));

    if (!rxCharacteristic || !txCharacteristic) {
      throw new NotFoundException('Could not find required charachteristics');
    }
    await new Promise<void>((resolve, reject) => txCharacteristic.subscribe(err => err ? reject(err) : resolve()));

    const observable: Observable<Buffer> = new Observable<Buffer>((observer: Observer<Buffer>) => {
      txCharacteristic.on('data', data => observer.next(data));
      device.on('disconnect', () => {
        this.eventEmitter.emit('serial:closed');
        observer.complete();
      });
    });


    return new AnonymousSubject({
      next: async (payload: Buffer) => {
        let data = serializeCommandBuffer(payload);
        if (data.length <= 20) {
          await new Promise<void>((resolve, reject) => rxCharacteristic.write(data, true, err => err ? reject(err) : resolve()));
        } else {
          while (data.length > 20) {
            const chunk: Buffer = data.slice(0, 20);
            data = data.slice(20);
            await new Promise<void>((resolve, reject) => rxCharacteristic.write(chunk, true, err => err ? reject(err) : resolve()));

          }
          await new Promise<void>((resolve, reject) => rxCharacteristic.write(data, true, err => err ? reject(err) : resolve()));
        }
      },
      error: (error) => {
        console.error(error);
        this.disconnect();
      },
      complete: () => this.disconnect()
    }, observable.pipe(
      deserializeResponse
    ));
  }

  disconnect(): Promise<void> {
    if (this.device) {
      return new Promise((resolve) => this.device.disconnect(() => resolve()));
    }

    return Promise.resolve();
  }

  private startScanningAndFindDevice(): Promise<Peripheral> {
    return new Observable<Peripheral>((observer: Observer<Peripheral>) => {
      noble.on('discover', (device: Peripheral) => {
        if (device.advertisement.localName == 'STORMCORE') {
          observer.next(device);
          observer.complete();
        }
      });
    }).pipe(
      doOnSubscribe(() => noble.startScanning(environment.BLE.service.uuid)),
      tap(() => noble.stopScanning()),
      first(),
      timeout(10000),
      catchError(async (err) => {
        console.log(err);
        await new Promise(resolve => noble.stopScanning(resolve));
        throw err;
      })
    ).toPromise();
  }
}
