import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { VESCService } from '../services/vesc.service';
import { from, Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

@WebSocketGateway()
export class SocketGateway {

  socket;

  constructor(private vesc: VESCService) {
  }


  @SubscribeMessage('connect')
  handleEvent(@MessageBody() data: string,
              @ConnectedSocket() client): Observable<any> {

    return from(this.vesc.connect()).pipe(
      switchMap(() => this.vesc.getFirmwareVersion()),
      finalize(() => client.close()),
    );
  }
}
