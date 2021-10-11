import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ModalComponent } from './components/modal/modal.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SpinnerComponent, ModalComponent],
  exports: [SpinnerComponent, ModalComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule {

}
