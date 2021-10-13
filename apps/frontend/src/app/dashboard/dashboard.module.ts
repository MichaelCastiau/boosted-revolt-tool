import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { CommonModule } from '@angular/common';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardSettingsComponent } from './components/dashboard-settings/dashboard-settings.component';
import { LoadingComponent } from './components/loading/loading.component';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from './store/dashboard.reducer';

@NgModule({
  declarations: [
    HomePageComponent,
    StatusBarComponent,
    MenuBarComponent,
    DashboardSettingsComponent,
    LoadingComponent
  ],
  imports: [
    RouterModule.forChild([{
      path: 'home',
      component: HomePageComponent
    }]),
    StoreModule.forFeature('dashboard', dashboardReducer),
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule {

}
