import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/store';
import { selectIsConnected } from '../../../vesc/store/vesc.selectors';
import { connectToVESC } from '../../../vesc/store/vesc.actions';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit {
  isConnected$: Observable<boolean>;

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit(): void {
    this.isConnected$ = this.store.pipe(selectIsConnected);
  }

  connect(){
    this.store.dispatch(connectToVESC());
  }
}
