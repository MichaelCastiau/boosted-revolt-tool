import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { bleReducer } from './store/ble.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BleEffects } from './store/ble.effects';
import { BLEService } from './ble.service';

@NgModule({
  imports: [
    StoreModule.forFeature('ble', bleReducer),
    EffectsModule.forFeature([BleEffects])
  ],
  providers: [
    BLEService
  ]
})
export class BLEModule {

}
