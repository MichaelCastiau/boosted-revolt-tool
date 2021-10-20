import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppData } from '../../../vesc/app-data';
import { Store } from '@ngrx/store';
import { selectAppSettings } from '../../../vesc/store/vesc.selectors';
import { IAppState } from '../../../store/store';
import { selectVESCIsConfiguredForDashboard } from '../../store/dashboard.selectors';
import { configureVESC } from '../../../vesc/store/vesc.actions';

@Component({
  selector: 'app-vesc-settings',
  templateUrl: './vesc-settings.component.html',
  styleUrls: ['./vesc-settings.component.scss']
})
export class VescSettingsComponent implements OnInit {
  appSettings$: Observable<IAppData>;
  configurationValid$: Observable<boolean>;

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit(): void {
    this.appSettings$ = this.store.pipe(selectAppSettings);
    this.configurationValid$ = this.store.pipe(
      selectVESCIsConfiguredForDashboard
    );
  }

  configure() {
    this.store.dispatch(configureVESC());
  }

}
