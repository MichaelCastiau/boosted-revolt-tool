import { Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from './store/store';
import { disconnect } from './vesc/store/vesc.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(private store: Store<IAppState>) {
  }

  @HostListener('window:beforeunload')
  beforeUnload() {
    this.store.dispatch(disconnect());
  }
}
