import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {
  @Input()
  visible = false;
  isVisible$: Observable<boolean> = new BehaviorSubject(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes.visible.previousValue != changes.visible.currentValue) {
      if ((this.isVisible$ as BehaviorSubject<boolean>).value === null && changes.visible.currentValue === false) {
        return;
      }
      (this.isVisible$ as BehaviorSubject<boolean>).next(changes.visible.currentValue);
    }
  }

}
