import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/store';
import {
  selectIsConnected,
  selectDashboardBatteryConfiguration,
  selectDashboardMetricSystem
} from '../../../vesc/store/vesc.selectors';
import { connectToVESC, setBatteryConfiguration, setMetricSystem } from '../../../vesc/store/vesc.actions';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit {
  isConnected$: Observable<boolean>;

  readonly batteryConfigurations: Array<number> = [];
  activeConfiguration$: Observable<number>;
  metricSystem$: Observable<'kmh' | 'mph'>;

  constructor(private store: Store<IAppState>) {
    for (let i = 10; i < 19; ++i) {
      this.batteryConfigurations.push(i);
    }
  }

  ngOnInit(): void {
    this.isConnected$ = this.store.pipe(selectIsConnected);
    this.activeConfiguration$ = this.store.pipe(selectDashboardBatteryConfiguration);
    this.metricSystem$ = this.store.pipe(selectDashboardMetricSystem);
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
}
