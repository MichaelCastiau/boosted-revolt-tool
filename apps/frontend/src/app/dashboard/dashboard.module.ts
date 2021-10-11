import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { CommonModule } from '@angular/common';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardSettingsComponent } from './components/dashboard-settings/dashboard-settings.component';

@NgModule({
  declarations: [
    HomePageComponent,
    StatusBarComponent,
    MenuBarComponent,
    DashboardSettingsComponent
  ],
  imports: [
    RouterModule.forChild([{
      path: 'home',
      component: HomePageComponent
    }]),
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule {

}
