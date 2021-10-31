import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { bleReducer } from './store/ble.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BleEffects } from './store/ble.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('ble', bleReducer),
    EffectsModule.forFeature([BleEffects])
  ],
  providers: []
})
export class BLEModule {

}
