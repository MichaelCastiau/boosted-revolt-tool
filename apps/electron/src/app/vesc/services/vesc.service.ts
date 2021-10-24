import { SerialPortService } from '../../serial-port/serial-port.service';
import { Injectable } from '@nestjs/common';
import { PortNotFoundException } from '../../exceptions/port-not-found.exception';
import {
  ADCControlType,
  AppUse,
  CANBaud,
  CANMode,
  CANStatusMode,
  ICustomVESCConfig,
  IVESCFirmwareInfo,
  VESCCommands
} from '../models/datatypes';
import { filter, first, map, mapTo, switchMap, tap, timeout } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { doOnSubscribe } from '../../helpers/onsubscribe.helper';
import { deserializeAppData, setVescConfig } from '../../helpers/serializer.helper';
import { IAppData } from '../models/app-data';

@Injectable()
export class VESCService {

  private socket: Subject<Buffer>;
  public static VESC_DEFAULT_CONFIG: ICustomVESCConfig = {
    appToUse: AppUse.APP_ADC_UART,
    canMode: CANMode.CAN_MODE_VESC,
    canStatusMode: CANStatusMode.CAN_STATUS_1_2_3_4_5,
    canBaudRate: CANBaud.CAN_BAUD_500K,
    controllerId: 22,
    canStatusRateHz: 5,
    adc: {
      controlType: ADCControlType.ADC_CTRL_TYPE_CURRENT_REV_CENTER,
      minVoltage: 1.7,
      centerVoltage: 2.3,
      maxVoltage: 3.1
    }
  };

  constructor(private serial: SerialPortService) {
  }

  async connect(): Promise<Observable<any>> {
    if (!this.serial.isConnected()) {
      // First find the port the vesc is connected to
      const port = await this.serial.findVESCPort();
      if (!port) {
        throw new PortNotFoundException();
      }
      this.socket = await this.serial.openPort(port);
    }

    return this.socket;
  }

  getFirmwareVersion(): Observable<IVESCFirmwareInfo> {
    return this.socket.pipe(
      filter(data => data?.readUInt8(0) === VESCCommands.COMM_FW_VERSION),
      first(),
      map(data => {
        return {
          version: `${data.readUInt8(1)}.${data.readUInt8(2)}`,
          name: Buffer.from(data.slice(3, 15)).toString('utf-8')
        };
      }),
      doOnSubscribe(() => this.socket.next(Buffer.from([VESCCommands.COMM_FW_VERSION])))
    );
  }

  isConnected(): boolean {
    return this.serial.isConnected();
  }

  async forwardCANMessage(config: {
    extendedId: number,
    data: Buffer
  }) {
    /*
    CAN COMMAND,
    extended id (4 bytes)
    is extended? (1 byte)
     */
    const command = Buffer.from([0, 0, 0, environment.CAN.extendedId, 1, ...config.data]);
    return this.socket.next(Buffer.from([VESCCommands.COMM_CAN_FWD_FRAME, ...command]));
  }

  getAppSettings(): Observable<IAppData> {
    return this.getAppSettingsRawBuffer().pipe(
      map(buffer => deserializeAppData(buffer))
    );
  }

  private getAppSettingsRawBuffer(): Observable<Buffer> {
    return this.socket.pipe(
      doOnSubscribe(() => this.socket.next(Buffer.from([VESCCommands.COMM_GET_APPCONF]))),
      filter(buffer => buffer.readUInt8(0) === VESCCommands.COMM_GET_APPCONF),
      first(),
      map(buffer => buffer.slice(1)),
      timeout(700)
    );
  }

  configureForDashboard(): Observable<void> {
    return this.getAppSettingsRawBuffer().pipe(
      map((data: Buffer) => setVescConfig(3264926020, VESCService.VESC_DEFAULT_CONFIG, data)),
      map(data => this.socket.next(Buffer.from([VESCCommands.COMM_SET_APPCONF, ...data]))),
      switchMap(() => this.socket),
      //Wait for response, response meaning write was successful
      tap(console.log),
      filter(buffer => buffer.readUInt8(1) === VESCCommands.COMM_SET_APPCONF),
      first(),
      mapTo(undefined),
      timeout(2500)
    );
  }
}
