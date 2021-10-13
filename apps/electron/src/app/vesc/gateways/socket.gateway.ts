import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { VESCService } from '../services/vesc.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
    return from(this.vesc.connect()).pipe(
      switchMap(() => this.vesc.getFirmwareVersion())
    );
  }
}
