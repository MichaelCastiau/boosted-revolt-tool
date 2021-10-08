import {Routes} from '@angular/router';
import {VescConnectPageComponent} from './vesc/pages/vesc-connect.page';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'connect'
  },
  {
    path: 'connect',
    component: VescConnectPageComponent
  }
]
