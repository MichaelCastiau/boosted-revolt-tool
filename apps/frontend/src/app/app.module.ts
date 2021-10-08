import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {ROUTES} from './app.routes';
import {VESCModule} from './vesc/vesc.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    VESCModule,
    RouterModule.forRoot(ROUTES),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
