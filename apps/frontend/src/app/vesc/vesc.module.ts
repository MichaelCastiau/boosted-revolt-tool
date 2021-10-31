import { NgModule } from '@angular/core';
import { VescConnectPageComponent } from './pages/vesc-connect.page';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { VESCEffects } from './store/vesc.effects';
import { VESCService } from './services/vesc.service';
import { HttpClientModule } from '@angular/common/http';
import { vescReducer } from './store/vesc.reducer';
import { CommonModule } from '@angular/common';
import { BLEModule } from '../ble/ble.module';

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('vesc', vescReducer),
    EffectsModule.forFeature([VESCEffects]),
    HttpClientModule,
    CommonModule,
    BLEModule
  ],
  declarations: [
    VescConnectPageComponent
  ],
  providers: [
    VESCService
  ]
})
export class VESCModule {

}
