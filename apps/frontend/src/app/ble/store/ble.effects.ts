import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { connectToVESC, connectToVESCFail } from '../../vesc/store/vesc.actions';
import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { WebsocketService } from '../../shared/services/websocket.service';
import { doOnSubscribe } from '@shared/doOnSubscribe';
import { foundBLEDevice, startScanning } from './ble.actions';
import { of } from 'rxjs';

@Injectable()
export class BleEffects {
  startScanning$ = createEffect(() => this.actions$.pipe(
    ofType(startScanning),
    mergeMap(() => {
      const socket = this.socket.openSocket();
      return socket.pipe(
        doOnSubscribe(() => socket.next({ event: 'scan:start' })),
        takeUntil(this.actions$.pipe(ofType(connectToVESC, connectToVESCFail)))
      );
    }),
    filter(message => message.event === 'scan:device-found'),
    map(message => foundBLEDevice({ device: message.data.device })),
    catchError(error => of(connectToVESCFail({ error })))
  ));

  constructor(private actions$: Actions,
              private socket: WebsocketService) {
  }
}
