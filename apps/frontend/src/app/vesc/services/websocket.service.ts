import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/store';

@Injectable()
export class WebsocketService {
  constructor(private store: Store<IAppState>) {
  }

  openSocket(): WebSocketSubject<any> {
    return webSocket('ws://localhost:3333');
  }
}
