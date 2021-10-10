import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { CommonModule } from '@angular/common';
import { StatusBarComponent } from './components/status-bar/status-bar.component';

@NgModule({
  declarations: [
    HomePageComponent,
    StatusBarComponent
  ],
  imports: [
    RouterModule.forChild([{
      path: 'home',
      component: HomePageComponent
    }]),
    CommonModule
  ]
})
export class DashboardModule {

}
