import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { VESCService } from '../services/vesc.service';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { OnEvent } from '@nestjs/event-emitter';
import { IVESCFirmwareInfo } from '../models/datatypes';

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
  handleEvent(@MessageBody() data: { way: 'usb' | 'ble' },
              @ConnectedSocket() client): Observable<IVESCFirmwareInfo | undefined> {
    this.socket = client;

    return from(
      this.vesc.setConnectionMethod(data.way)
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
}
