import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/store';
import { connectToVESC } from '../store/vesc.actions';
import { Observable, Subject } from 'rxjs';
import { selectConnectionError, selectIsConnected, selectIsConnecting } from '../store/vesc.selectors';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vesc-connect',
  templateUrl: './vesc-connect.page.html',
  styleUrls: ['./vesc-connect.page.scss']
})
export class VescConnectPageComponent implements OnInit, OnDestroy {
  isConnecting$: Observable<boolean>;
  connectionError$: Observable<Error>;
  isConnected$: Observable<boolean>;

  private destroy$ = new Subject();
  private lastConnectionWay: 'usb' | 'ble' = 'usb';

  constructor(private store: Store<IAppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.isConnecting$ = this.store.pipe(selectIsConnecting);
    this.connectionError$ = this.store.pipe(selectConnectionError);
    this.isConnected$ = this.store.pipe(selectIsConnected);

    this.isConnected$.pipe(
      takeUntil(this.destroy$),
      filter(isConnected => isConnected),
      take(1),
      tap(() => this.router.navigate(['/', 'home']))
    ).subscribe();

  }

  isWindows() {
    //BLE functionality doesn't work on Windows
    return navigator.platform === 'Win32' || navigator.platform === 'Win64';
  }

  connectViaUSB() {
    this.lastConnectionWay = 'usb';
    this.store.dispatch(connectToVESC({ way: 'usb' }));

  }

  connectViaBLE() {
    this.lastConnectionWay = 'ble';
    this.store.dispatch(connectToVESC({ way: 'ble' }));
  }

  retry() {
    this.store.dispatch(connectToVESC({ way: this.lastConnectionWay }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
