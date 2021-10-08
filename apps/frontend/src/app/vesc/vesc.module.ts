import {NgModule} from '@angular/core';
import {VescConnectPageComponent} from './pages/vesc-connect.page';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    VescConnectPageComponent
  ]
})
export class VESCModule {

}
