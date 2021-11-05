import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/store';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { connectionLost } from '../../vesc/store/vesc.actions';
import { interval, Subject } from 'rxjs';

@Injectable()
export class WebsocketService {
  newConnection$ = new Subject();
  socket: WebSocketSubject<{ event: string, data?: any }>;

  constructor(private store: Store<IAppState>) {
  }

  openSocket(): WebSocketSubject<{ event: string, data?: any }> {
    if (!this.socket || this.socket.isStopped) {
      this.newConnection$.next();
      this.newConnection$.complete();
    }


    this.newConnection$ = new Subject<void>();
    this.socket = webSocket('ws://localhost:3333');

    interval(5000).pipe(
      takeUntil(this.newConnection$),
      tap(() => this.socket.next({event: 'keep-alive'}))
    ).subscribe();

    this.socket.pipe(
      takeUntil(this.newConnection$),
      finalize(() => this.store.dispatch(connectionLost({})))
    ).subscribe();
    return this.socket;
  }
}
