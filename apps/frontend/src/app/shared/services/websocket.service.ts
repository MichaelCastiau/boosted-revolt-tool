import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/store';
import { finalize, takeUntil } from 'rxjs/operators';
import { connectionLost } from '../../vesc/store/vesc.actions';
import { Subject } from 'rxjs';

@Injectable()
export class WebsocketService {
  newConnection$ = new Subject();

  constructor(private store: Store<IAppState>) {
  }

  openSocket(): WebSocketSubject<any> {
    this.newConnection$.next();
    this.newConnection$.complete();

    this.newConnection$ = new Subject<void>();
    const socket = webSocket('ws://localhost:3333');
    socket.pipe(
      takeUntil(this.newConnection$),
      finalize(() => this.store.dispatch(connectionLost({})))
    ).subscribe();
    return socket;
  }
}
