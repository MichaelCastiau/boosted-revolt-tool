import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/store';
import { connectToVESC, connectToVESCViaUSB } from '../store/vesc.actions';
import { Observable, Subject } from 'rxjs';
import { selectConnectionError, selectIsConnected, selectIsConnecting } from '../store/vesc.selectors';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { connectToVESCViaBLE, startScanning, stopScanning } from '../../ble/store/ble.actions';
import { IDeviceInfo } from '@shared/device';
import { selectFoundBLEDevices, selectIsScanning } from '../../ble/store/ble.selectors';

@Component({
  selector: 'app-vesc-connect',
  templateUrl: './vesc-connect.page.html',
  styleUrls: ['./vesc-connect.page.scss']
})
export class VescConnectPageComponent implements OnInit, OnDestroy {
  isConnecting$: Observable<boolean>;
  connectionError$: Observable<Error>;
  isConnected$: Observable<boolean>;
  isScanning$: Observable<boolean>;

  connectingViaBLE$ = new Subject<boolean>();
  windowsWarning$ = new Subject<boolean>();
  foundBLEDevices$: Observable<Array<IDeviceInfo>>;

  private destroy$ = new Subject();

  constructor(private store: Store<IAppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.isConnecting$ = this.store.pipe(selectIsConnecting);
    this.connectionError$ = this.store.pipe(selectConnectionError);
    this.isConnected$ = this.store.pipe(selectIsConnected);
    this.foundBLEDevices$ = this.store.pipe(selectFoundBLEDevices);
    this.isScanning$ = this.store.pipe(selectIsScanning);

    this.isConnected$.pipe(
      takeUntil(this.destroy$),
      filter(isConnected => isConnected),
      take(1),
      tap(() => this.router.navigate(['/', 'home']))
    ).subscribe();

  }

  connectViaUSB() {
    this.store.dispatch(connectToVESCViaUSB());
  }

  startScanning() {
    if (window.navigator.platform?.toLowerCase() == 'win32') {
      return this.windowsWarning$.next(true);
    }
    this.connectingViaBLE$.next(true);
    this.store.dispatch(startScanning());
  }

  retry() {
    this.store.dispatch(connectToVESC());
  }

  connectViaBLE(device: IDeviceInfo) {
    this.store.dispatch(stopScanning());
    this.store.dispatch(connectToVESCViaBLE({ deviceId: device.id }));
  }

  closeHere() {
    alert('hi');
  }

  goBack() {
    this.store.dispatch(stopScanning());
    this.connectingViaBLE$.next(false);
  }

  proceed() {
    this.windowsWarning$.next(false);
    this.connectingViaBLE$.next(true);
    this.store.dispatch(startScanning());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
