import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ModalComponent } from './components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { WebsocketService } from './services/websocket.service';

@NgModule({
  declarations: [SpinnerComponent, ModalComponent],
  exports: [SpinnerComponent, ModalComponent],
  imports: [
    CommonModule
  ],
  providers: [
    WebsocketService
  ]
})
export class SharedModule {

}
