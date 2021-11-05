import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';
import { from, Observable, Observer } from 'rxjs';
import * as noble from '@abandonware/noble';
import { Peripheral } from '@abandonware/noble';
import { catchError, filter, finalize, first, switchMap, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { deserializeResponse, serializeCommandBuffer } from '../helpers/serializer.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BLEService implements BeforeApplicationShutdown {
  private device: Peripheral;

  constructor(private eventEmitter: EventEmitter2) {
  }

  async beforeApplicationShutdown(signal?: string) {
    await this.disconnect();
  }

  findDevice(deviceId: string): Promise<Peripheral> {
    return this.startScanningAndFindDevice().pipe(
      filter(device => device.id === deviceId),
      timeout(10000),
      first(),
      finalize(() => this.stopScanning())
    ).toPromise();
  }

  isConnected() {
    return !!this.device && this.device.state === 'connected';
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
      device.on('disconnect', async () => {
        await txCharacteristic.unsubscribeAsync();
        txCharacteristic.removeAllListeners();
        this.device = null;
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

  async disconnect(): Promise<void> {
    if (this.device) {
      console.log('INFO: disconnecting from BLE device');
      await this.device.disconnectAsync();
    }
    this.device = null;
  }

  startScanningAndFindDevice(): Observable<Peripheral> {
    //Wait for state to be powered on
    const state$ = new Observable<string>(observer => {
      noble.on('stateChange', (state) => observer.next(state));
      observer.next(noble.state);
    }).pipe(
      filter(state => state === 'poweredOn'),
      timeout(500)
    );
    return state$.pipe(
      first(),
      switchMap(() => from(noble.startScanningAsync([
        environment.BLE.service.uuid
      ], false))),
      switchMap(() => new Observable<Peripheral>((observer: Observer<Peripheral>) => {
        noble.on('discover', (device: Peripheral) => observer.next(device));
      })),
      switchMap((device: Peripheral) => from(noble.stopScanningAsync().then(() => device)) as Observable<Peripheral>),
      timeout(25000),
      catchError(async (err) => {
        await noble.stopScanningAsync();
        throw err;
      })
    );
  }

  stopScanning() {
    return noble.stopScanningAsync();
  }
}
