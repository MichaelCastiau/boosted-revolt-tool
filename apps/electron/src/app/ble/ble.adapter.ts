import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { IVESCAdapter } from '../vesc/adapter/vesc.adapter';
import { BLEService } from './ble.service';
import { Peripheral } from '@abandonware/noble';
import { tap } from 'rxjs/operators';

@Injectable()
export class BLEAdapter implements IVESCAdapter {

  constructor(private ble: BLEService) {
  }

  isConnected(): boolean {
    return false;
  }

  async connect(): Promise<Subject<Buffer>> {
    //   const device: Peripheral = await this.ble.findDevice();
    /*   try {
         return await this.ble.connect(device);
       } catch (error) {
         await this.ble.disconnect();
         throw error;
       }*/
    return null;
  }

  disconnect(): Promise<void> {
    return this.ble.disconnect();
  }

  searchForDevices(): Observable<Peripheral> {
    return this.ble.startScanningAndFindDevice().pipe(
      tap(console.log)
    );
  }


}
