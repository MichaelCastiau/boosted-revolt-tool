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
import {
  connectToVESC,
  setBatteryConfiguration,
  setMetricSystem,
  setWheelCircumference
} from '../../../vesc/store/vesc.actions';
import { takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

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
  customTire = new FormControl();

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

  setWheel(circumferenceMM: number) {
    this.store.dispatch(setWheelCircumference({ circumferenceMM }));
  }

  useCustomTire() {
    try {
      const tireCircumference = parseInt(this.customTire.value);
      if (isNaN(tireCircumference)) {
        throw new Error('Not a number');
      }
      this.store.dispatch(setWheelCircumference({ circumferenceMM: tireCircumference }));
    } catch (error) {
      this.toastr.error('Please provide a valid tire circumference value, in mm', 'Wrong tire circumference');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
