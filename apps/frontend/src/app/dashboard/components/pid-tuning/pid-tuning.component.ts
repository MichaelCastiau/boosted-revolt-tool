import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PIDParameter } from '@shared/types';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/store';
import { selectADCEnabled, selectIsCurrentControl, selectPIDParameters } from '../../store/dashboard.selectors';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { setPID, setUseADCThrottle, setUseCurrentControl } from '../../../vesc/store/vesc.actions';
import { selectConfiguringDashboardError } from '../../../vesc/store/vesc.selectors';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pid-tuning',
  templateUrl: './pid-tuning.component.html',
  styleUrls: ['./pid-tuning.component.scss']
})
export class PidTuningComponent implements OnInit, OnDestroy {
  $pid: Observable<PIDParameter>;
  $adcIsEnabled: Observable<boolean>;
  $isCurrentControl: Observable<boolean>;

  pidForm: UntypedFormGroup;
  private destroy$ = new Subject();

  constructor(private store: Store<IAppState>, private formBuilder: UntypedFormBuilder, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.$pid = this.store.pipe(selectPIDParameters);
    this.$adcIsEnabled = this.store.pipe(selectADCEnabled);
    this.$isCurrentControl = this.store.pipe(selectIsCurrentControl);

    this.pidForm = this.formBuilder.group({
      kp: [0, []],
      ki: [0, []],
      kd: [0, []]
    });

    this.$pid.pipe(
      tap(pid => this.pidForm.patchValue({
        kp: pid.kp,
        ki: pid.ki,
        kd: pid.kd
      })),
      takeUntil(this.destroy$)
    ).subscribe();


    this.store.pipe(
      selectConfiguringDashboardError,
      takeUntil(this.destroy$),
      tap(() => this.toastr.error('Make sure your dashboard is on and correctly wired to your VESC', 'Dashboard Not Configured'))
    ).subscribe();
  }


  enableDashADC(useADCThrottle: boolean) {
    this.store.dispatch(setUseADCThrottle({ useADCThrottle }));
  }

  useCurrentControl(useCurrentControl: boolean) {
    this.store.dispatch(setUseCurrentControl({ useCurrentControl }));
  }

  applyPID() {
    const pid: PIDParameter = {
      kp: parseFloat(this.pidForm.get('kp').value) * 1e5,
      ki: parseFloat(this.pidForm.get('ki').value) * 1e5,
      kd: parseFloat(this.pidForm.get('kd').value) * 1e5
    };
    this.store.dispatch(setPID({ pid }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
