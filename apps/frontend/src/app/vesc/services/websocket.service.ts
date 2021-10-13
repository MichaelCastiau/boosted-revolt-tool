import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/store';
import { finalize } from 'rxjs/operators';
import { connectionLost } from '../store/vesc.actions';

@Injectable()
export class WebsocketService {
  constructor(private store: Store<IAppState>) {
  }

  openSocket(): WebSocketSubject<any> {
    const socket = webSocket('ws://localhost:3333');

    socket.pipe(finalize(() => this.store.dispatch(connectionLost({})))).subscribe();

    return socket;
  }
}
