import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsLoading, selectLoadingMessage } from '../../store/dashboard.selectors';
import { selectIsConnecting } from '../../../vesc/store/vesc.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  isLoading$: Observable<boolean>;
  loadingMessage$: Observable<string>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.isLoading$ = combineLatest([
      this.store.pipe(selectIsLoading),
      this.store.pipe(selectIsConnecting)
    ]).pipe(
      map(([a, b]) => a || b)
    );
    this.loadingMessage$ = this.store.pipe(selectLoadingMessage);
  }

}
