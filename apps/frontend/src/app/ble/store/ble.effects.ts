import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { connectToVESCFail } from '../../vesc/store/vesc.actions';
import { catchError, filter, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';
import { WebsocketService } from '../../shared/services/websocket.service';
import { doOnSubscribe } from '@shared/doOnSubscribe';
import { foundBLEDevice, startScanning, stopScanning } from './ble.actions';
import { of } from 'rxjs';
import { BLEService } from '../ble.service';

@Injectable()
export class BleEffects {
  startScanning$ = createEffect(() => this.actions$.pipe(
    ofType(startScanning),
    mergeMap(() => {
      const socket = this.socket.openSocket();
      return socket.pipe(
        doOnSubscribe(() => socket.next({ event: 'scan:start' })),
        takeUntil(this.actions$.pipe(ofType(stopScanning)))
      );
    }),
    filter(message => message.event === 'scan:device-found'),
    map(message => foundBLEDevice({ device: message.data.device })),
    catchError(error => of(connectToVESCFail({ error })))
  ));

  stopScanning$ = createEffect(() => this.actions$.pipe(
    ofType(stopScanning),
    switchMap(() => this.api.stopScanning())
  ), { dispatch: false });

  constructor(private actions$: Actions,
              private socket: WebsocketService,
              private api: BLEService) {
  }
}
