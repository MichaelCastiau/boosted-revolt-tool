import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/store';
import {
  selectConfiguringDashboardError,
  selectDashboardBatteryConfiguration,
  selectDashboardMetricSystem,
  selectIsConnected
} from '../../../vesc/store/vesc.selectors';
import { connectToVESC, setBatteryConfiguration, setMetricSystem } from '../../../vesc/store/vesc.actions';
import { takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { getDashboardFirmwareVersion } from '../../store/dashboard.actions';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit, OnDestroy {
  isConnected$: Observable<boolean>;

  readonly batteryConfigurations: Array<number> = [];
  activeConfiguration$: Observable<number>;
  metricSystem$: Observable<'kmh' | 'mph'>;

  private destroy$ = new Subject();

  constructor(private store: Store<IAppState>,
              private toastr: ToastrService) {
    for (let i = 10; i < 19; ++i) {
      this.batteryConfigurations.push(i);
    }
  }

  ngOnInit(): void {
    this.isConnected$ = this.store.pipe(selectIsConnected);
    this.activeConfiguration$ = this.store.pipe(selectDashboardBatteryConfiguration);
    this.metricSystem$ = this.store.pipe(selectDashboardMetricSystem);

    this.store.pipe(
      selectConfiguringDashboardError,
      takeUntil(this.destroy$),
      tap(() => this.toastr.error('Make sure your dashboard is on and correctly wired to your VESC', 'Dashboard Not Configured'))
    ).subscribe();
  }

  connect() {
    this.store.dispatch(connectToVESC());
  }

  setConfiguration(configuration: number) {
    this.store.dispatch(setBatteryConfiguration({ configuration }));
  }

  setMilesPerHour() {
    this.store.dispatch(setMetricSystem({ system: 'mph' }));
  }

  setKilometersPerHour() {
    this.store.dispatch(setMetricSystem({ system: 'kmh' }));
  }

  checkFirmwareVersion() {
    this.store.dispatch(getDashboardFirmwareVersion());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
