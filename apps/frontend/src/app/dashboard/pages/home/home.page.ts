import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../store/store';
import { selectIsConnecting } from '../../../vesc/store/vesc.selectors';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePageComponent implements OnInit {
  tab$: Observable<'dashboard'> = of('dashboard');
  isConnecting$: Observable<boolean>;

  constructor(private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.isConnecting$ = this.store.pipe(selectIsConnecting);
  }
}
