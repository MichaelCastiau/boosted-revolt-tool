import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getDashboardFirmwareVersion,
  getDashboardFirmwareVersionFail,
  getDashboardFirmwareVersionSuccess
} from './dashboard.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
export class DashboardEffects {
  getFirmwareVersion$ = createEffect(() => this.actions$.pipe(
    ofType(getDashboardFirmwareVersion),
    switchMap(() => this.api.getFirmwareVersion().pipe(
      map(version => getDashboardFirmwareVersionSuccess({ version })),
      catchError(error => of(getDashboardFirmwareVersionFail({ error })))
    ))
  ));

  constructor(private actions$: Actions, private api: DashboardService) {
  }
}
