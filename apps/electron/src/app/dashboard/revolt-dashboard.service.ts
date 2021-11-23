import { IDashboardAdapter } from './dashboard.adapter';
import { Observable, throwError } from 'rxjs';
import { VESCService } from '../vesc/services/vesc.service';
import { catchError, delay, mapTo, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BootloaderCommands, ENTER_BOOTLOADER } from './dashboard.datatypes';
import { MeasurementSystem } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { CANBaud, CANStatusMode } from '../vesc/models/datatypes';

@Injectable()
export class RevoltDashboardService implements IDashboardAdapter {
  constructor(private vesc: VESCService) {
  }

  detect(): Promise<boolean> {
    return Promise.resolve(false);
  }

  getFirmwareVersion(): Observable<string> {
    console.log('getting firmware version');


    return this.vesc.changeCANOperationMode({
      canBaud: CANBaud.CAN_BAUD_500K,
      statusMode: CANStatusMode.CAN_STATUS_DISABLED
    }).pipe(
      tap(() => this.enterBootloader()),
      tap(() => console.log('bootloader entered')),
      switchMap(() => this.vesc.setCanBaud(CANBaud.CAN_BAUD_125K)),
      delay(1500),
      tap(() => this.sendCommandToBootloader(BootloaderCommands.COMM_GET_VERSION)),
    //  switchMap(() => this.vesc.resumeNormalCANOperation()),
      catchError(error => this.vesc.resumeNormalCANOperation().pipe(switchMap(() => throwError(error)))),
      mapTo('1.0.0')
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
