import { Injectable } from '@nestjs/common';
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
import { filter, first, map, switchMap, timeout } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { doOnSubscribe } from '../../helpers/onsubscribe.helper';
import { deserializeAppData, setVescConfig } from '../../helpers/serializer.helper';
import { IAppData } from '../models/app-data';
import { IVESCAdapter } from '../adapter/vesc.adapter';
import { BleAdapter } from '../../ble/ble.adapter';
import { SerialPortAdapter } from '../../serial-port/serial-port.adapter';

@Injectable()
export class VESCService {

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
  private socket: Subject<Buffer>;
  private adapter: IVESCAdapter;

  constructor(private bleAdapter: BleAdapter,
              private usbAdapter: SerialPortAdapter) {
    this.adapter = usbAdapter;
  }

  async setConnectionMethod(method: 'usb' | 'ble') {
    if (this.adapter) {
      await this.adapter.disconnect();
    }
    switch (method) {
      case 'ble':
        this.adapter = this.bleAdapter;
        break;
      case 'usb':
      default:
        this.adapter = this.usbAdapter;
        break;
    }
  }

  async connect(): Promise<Observable<Buffer>> {
    if (!this.adapter.isConnected()) {
      // First find the port the vesc is connected to
      this.socket = await this.adapter.connect();
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
    return this.adapter.isConnected();
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

  configureForDashboard(): Observable<IAppData> {
    return this.getAppSettingsRawBuffer().pipe(
      map((data: Buffer) => setVescConfig(3264926020, VESCService.VESC_DEFAULT_CONFIG, data)),
      map(data => this.socket.next(Buffer.from([VESCCommands.COMM_SET_APPCONF, ...data]))),
      switchMap(() => this.socket),
      //Wait for response, response meaning write was successful
      filter(buffer => buffer.readUInt8(0) === VESCCommands.COMM_GET_APPCONF),
      first(),
      map(buffer => deserializeAppData(buffer.slice(1))),
      timeout(10000)
    );
  }

  private getAppSettingsRawBuffer(): Observable<Buffer> {
    return this.socket.pipe(
      doOnSubscribe(() => this.socket.next(Buffer.from([VESCCommands.COMM_GET_APPCONF]))),
      filter(buffer => buffer.readUInt8(0) === VESCCommands.COMM_GET_APPCONF),
      first(),
      map(buffer => buffer.slice(1)), //Command is removed
      timeout(5000)
    );
  }
}
