import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { provideNobleToken } from './noble.provider';
import { from, Observable, Observer } from 'rxjs';
import { Peripheral } from '@abandonware/noble';
import { first, switchMap, timeout } from 'rxjs/operators';
import { doOnSubscribe } from '../helpers/onsubscribe.helper';
import { environment } from '../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { serializeCommandBuffer } from '../helpers/serializer.helper';

@Injectable()
export class BLEService {
  constructor(@Inject(provideNobleToken) private noble) {
  }

  async findDevice(): Promise<Peripheral> {
    const device = await this.startScanningAndFindDevice();
    if (!device) {
      throw new NotFoundException('BLE VESC Device not found or timeout reached');
    }
    return device;
  }

  async connect(device: Peripheral) {
    await device.connectAsync();

    const { characteristics: [txCharacteristic, rxCharachteristic] } = await device.discoverSomeServicesAndCharacteristicsAsync([
      environment.BLE.service.uuid
    ], [
      environment.BLE.service.characteristics.tx,
      environment.BLE.service.characteristics.rx
    ]);


    return new AnonymousSubject({
      next: async (payload: Buffer) => {
        const data = serializeCommandBuffer(payload);
        await txCharacteristic.writeAsync(data, false);
      },
      error: (error) => {
        console.error(error);
        this.disconnect();
      },
      complete: () => this.disconnect()
    }, new Observable<Buffer>((observer: Observer<Buffer>) => {
      rxCharachteristic.on('data', (data, is) => {
       rxCharachteristic.read((error, data) => {
         console.log('data' , data);
       });
      })

      rxCharachteristic.subscribe();
    }));
  }

  disconnect() {

  }

  private startScanningAndFindDevice(): Promise<Peripheral> {
    return new Observable<Peripheral>((observer: Observer<Peripheral>) => {
      this.noble.on('discover', (device: Peripheral) => observer.next(device));
    }).pipe(
      doOnSubscribe(() => this.noble.startScanningAsync([environment.BLE.service.uuid])),
      switchMap((device: Peripheral) => from(this.noble.stopScanningAsync().then(() => device)) as Observable<Peripheral>),
      first(),
      timeout(10000)
    ).toPromise();
  }
}
