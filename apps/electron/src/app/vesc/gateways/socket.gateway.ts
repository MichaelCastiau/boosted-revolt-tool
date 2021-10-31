import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { VESCService } from '../services/vesc.service';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';
import { OnEvent } from '@nestjs/event-emitter';
import { IVESCFirmwareInfo } from '../models/datatypes';
import { IDeviceInfo } from '@shared/device';

@WebSocketGateway()
export class SocketGateway {

  socket;

  constructor(private vesc: VESCService) {
  }

  @OnEvent('serial:closed')
  onClosed() {
    this.socket?.close();
  }


  @SubscribeMessage('connect')
  connectToDevice(@MessageBody() data: { connectionType: 'usb' | 'ble', deviceId?: string },
                  @ConnectedSocket() client): Observable<{ event: 'vesc:info', data: { info: IVESCFirmwareInfo | undefined } }> {
    this.socket = client;

    console.log('Attempting to connect to device', data.deviceId, 'via', data.connectionType);

    return from(
      data?.connectionType ? this.vesc.setConnectionMethod(data.connectionType) : Promise.resolve()
    ).pipe(
      switchMap(() => from(this.vesc.connect(data?.deviceId))),
      switchMap(() => this.vesc.getFirmwareVersion()),
      map(info => ({ event: 'vesc:info', data: { info } })),
      timeout(10000),
      catchError((err) => {
        console.error(err);
        client.close();
        return of(undefined);
      })
    );
  }

  @SubscribeMessage('scan:start')
  startScan(): Observable<{ event: string, data: { device: IDeviceInfo } }> {
    // Start BLE scan
    return from(this.vesc.setConnectionMethod('ble')).pipe(
      switchMap(() => this.vesc.searchForDevices()),
      map(device => {
        return {
          event: 'scan:device-found',
          data: {
            device: {
              name: device.advertisement?.localName,
              id: device.id,
              uuid: device.uuid
            }
          }
        };
      })
    );

  }
}
