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
  connectToDevice(@MessageBody() data: { way: 'usb' | 'ble' },
                  @ConnectedSocket() client): Observable<IVESCFirmwareInfo | undefined> {
    this.socket = client;

    return from(
      data?.way ? this.vesc.setConnectionMethod(data.way) : Promise.resolve()
    ).pipe(
      switchMap(() => from(this.vesc.connect())),
      switchMap(() => this.vesc.getFirmwareVersion()),
      timeout(2000),
      catchError((err) => {
        console.error(err);
        client.close();
        return of(undefined);
      })
    );
  }

  @SubscribeMessage('scan:start')
  startScan(@ConnectedSocket() client): Observable<IDeviceInfo> {
    // Start BLE scan
    return from(this.vesc.setConnectionMethod('ble')).pipe(
      switchMap(() => this.vesc.searchForDevices()),
      map(device => {
        return {
          name: device.advertisement?.localName,
          id: device.id,
          uuid: device.uuid
        };
      })
    );

  }
}
