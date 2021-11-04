import { IDashboardAdapter } from './dashboard.adapter';
import { Observable } from 'rxjs';
import { VESCService } from '../vesc/services/vesc.service';
import { delay, finalize, mapTo, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BootloaderCommands, ENTER_BOOTLOADER } from './dashboard.datatypes';
import { MeasurementSystem } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { doOnSubscribe } from '@shared/doOnSubscribe';

@Injectable()
export class RevoltDashboardService implements IDashboardAdapter {
  constructor(private vesc: VESCService) {
  }

  detect(): Promise<boolean> {
    return Promise.resolve(false);
  }

  getFirmwareVersion(): Observable<string> {
    return this.vesc.enableCANBridgeMode().pipe(
      tap(() => this.sendCommandToBootloader(BootloaderCommands.COMM_GET_VERSION)),
      delay(5000),
      finalize(() => this.vesc.disableCANBrigeMode().subscribe()),
      mapTo('1.0.0'),
      doOnSubscribe(() => this.enterBootloader())
    );
  }

  enterBootloader() {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([ENTER_BOOTLOADER])
    });
  }

  setMeasurementSystem(system: MeasurementSystem = 'kmh') {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([system === 'kmh' ? 2 : 1])
    });
  }

  setBatteryConfiguration(series = 12) {
    return this.vesc.forwardCANMessage({
      extendedId: environment.CAN.extendedId,
      data: Buffer.from([4, series])
    });
  }

  private sendCommandToBootloader(command: BootloaderCommands, dlc?) {
    return this.vesc.forwardCANMessage({
      extendedId: command,
      data: dlc ? Buffer.from([]) : Buffer.from([dlc]),
      readReply: true
    });
  }

}
