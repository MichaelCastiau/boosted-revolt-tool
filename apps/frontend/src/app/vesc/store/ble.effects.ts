import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { startScanning } from './vesc.actions';
import { map, mergeMap } from 'rxjs/operators';
import { WebsocketService } from '../services/websocket.service';
import { doOnSubscribe } from '@shared/doOnSubscribe';

@Injectable()
export class BleEffects {
  startScanning$ = createEffect(() => this.actions$.pipe(
    ofType(startScanning),
    mergeMap(() => {
      const socket = this.socket.openSocket();
      return socket.pipe(
        doOnSubscribe(() => socket.next({ event: 'scan:start' }))
      );
    }),
    map((message) => {
      console.log(message);
      return ({ type: 'no action' });
    })
  ));

  constructor(private actions$: Actions,
              private socket: WebsocketService) {
  }
}
