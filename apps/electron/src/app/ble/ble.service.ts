import { Injectable, NotFoundException } from '@nestjs/common';
import { from, Observable, Observer } from 'rxjs';
import * as noble from '@abandonware/noble';
import { Peripheral } from '@abandonware/noble';
import { catchError, first, switchMap, take, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { deserializeResponse, serializeCommandBuffer } from '../helpers/serializer.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { doOnSubscribe } from '@shared/doOnSubscribe';

@Injectable()
export class BLEService {
  private device: Peripheral;

  constructor(private eventEmitter: EventEmitter2) {
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

  startScanningAndFindDevice(): Observable<Peripheral> {
    return new Observable<Peripheral>((observer: Observer<Peripheral>) => {
      noble.on('discover', (device: Peripheral) => {
        console.log('device', device);
        observer.next(device)
      });
    }).pipe(
      doOnSubscribe(() => noble.startScanningAsync([
        environment.BLE.service.uuid,
      ], false)),
      switchMap((device: Peripheral) => from(noble.stopScanningAsync().then(() => device)) as Observable<Peripheral>),
      timeout(25000),
      catchError(async (err) => {
        await noble.stopScanningAsync();
        throw err;
      })
    );
  }
}
