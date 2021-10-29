import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/store';
import { selectConnectionError } from '../../../vesc/store/vesc.selectors';
import { connectToVESC } from '../../../vesc/store/vesc.actions';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePageComponent implements OnInit {
  tab$: Subject<'dashboard' | 'vesc'> = new BehaviorSubject('dashboard');
  errorConnecting$: Observable<Error>;

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.errorConnecting$ = this.store.pipe(selectConnectionError);
  }

  retry() {
    this.store.dispatch(connectToVESC({}));
  }
}
