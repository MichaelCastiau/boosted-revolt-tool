import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppData } from '../../../vesc/app-data';
import { Store } from '@ngrx/store';
import { selectAppSettings } from '../../../vesc/store/vesc.selectors';
import { IAppState } from '../../../store/store';

@Component({
  selector: 'app-vesc-settings',
  templateUrl: './vesc-settings.component.html',
  styleUrls: ['./vesc-settings.component.scss']
})
export class VescSettingsComponent implements OnInit {
  appSettings$: Observable<IAppData>;

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit(): void {
    this.appSettings$ = this.store.pipe(selectAppSettings);
  }

}
