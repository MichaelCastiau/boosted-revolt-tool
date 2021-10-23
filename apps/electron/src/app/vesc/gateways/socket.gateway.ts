import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { VESCService } from '../services/vesc.service';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { OnEvent } from '@nestjs/event-emitter';

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
  handleEvent(@MessageBody() data: string,
              @ConnectedSocket() client): Observable<any> {
    this.socket = client;

    if(this.vesc.isConnected()){
      return this.vesc.getFirmwareVersion();
    }

    return from(this.vesc.connect()).pipe(
      timeout(2000),
      switchMap(() => this.vesc.getFirmwareVersion()),
      catchError(err => {
        client.close();
        return of(undefined);
      })
    );
  }
}
