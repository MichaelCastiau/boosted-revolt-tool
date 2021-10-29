import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { provideNobleToken } from './noble.provider';
import { from, Observable, Observer } from 'rxjs';
import { Peripheral } from '@abandonware/noble';
import { catchError, first, switchMap, timeout } from 'rxjs/operators';
import { doOnSubscribe } from '../helpers/onsubscribe.helper';
import { environment } from '../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { deserializeResponse, serializeCommandBuffer } from '../helpers/serializer.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BLEService {
  private device: Peripheral;

  constructor(@Inject(provideNobleToken) private noble,
              private eventEmitter: EventEmitter2) {
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
    await device.connectAsync();

    const { characteristics: [rxCharachteristic, txCharacteristic] } = await device.discoverSomeServicesAndCharacteristicsAsync([
      environment.BLE.service.uuid
    ], [
      environment.BLE.service.characteristics.tx,
      environment.BLE.service.characteristics.rx
    ]);

    await txCharacteristic.subscribeAsync();

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
          await rxCharachteristic.writeAsync(data, true);
        } else {
          while (data.length > 20) {
            const chunk: Buffer = data.slice(0, 20);
            data = data.slice(20);
            await rxCharachteristic.writeAsync(chunk, true);
          }
          await rxCharachteristic.writeAsync(data, true);
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
      return this.device.disconnectAsync();
    }

    return Promise.resolve();
  }

  private startScanningAndFindDevice(): Promise<Peripheral> {
    return new Observable<Peripheral>((observer: Observer<Peripheral>) => {
      this.noble.on('discover', (device: Peripheral) => observer.next(device));
    }).pipe(
      doOnSubscribe(() => this.noble.startScanningAsync([environment.BLE.service.uuid])),
      switchMap((device: Peripheral) => from(this.noble.stopScanningAsync().then(() => device)) as Observable<Peripheral>),
      first(),
      timeout(10000),
      catchError((err) => {
        this.noble.stopScanningAsync();
        throw err;
      })
    ).toPromise();
  }
}
