import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IAppData } from '../../../vesc/app-data';
import { Store } from '@ngrx/store';
import {
  selectAppSettings,
  selectConfiguringVESCError,
  selectWritingAppSettings
} from '../../../vesc/store/vesc.selectors';
import { IAppState } from '../../../store/store';
import { selectVESCIsConfiguredForDashboard } from '../../store/dashboard.selectors';
import { configureVESC } from '../../../vesc/store/vesc.actions';
import { takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vesc-settings',
  templateUrl: './vesc-settings.component.html',
  styleUrls: ['./vesc-settings.component.scss']
})
export class VescSettingsComponent implements OnInit, OnDestroy {
  appSettings$: Observable<IAppData>;
  configurationValid$: Observable<boolean>;
  isWritingAppSettings$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(private store: Store<IAppState>,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.appSettings$ = this.store.pipe(selectAppSettings);
    this.configurationValid$ = this.store.pipe(
      selectVESCIsConfiguredForDashboard
    );
    this.isWritingAppSettings$ = this.store.pipe(selectWritingAppSettings);

    this.store.pipe(
      selectConfiguringVESCError,
      takeUntil(this.destroy$),
      tap(() => this.toastr.error('We failed to configure your VESC. Please make sure your VESC is switched on and connected through USB', 'Configuring VESC Fail'))
    ).subscribe();
  }

  configure() {
    this.store.dispatch(configureVESC());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
