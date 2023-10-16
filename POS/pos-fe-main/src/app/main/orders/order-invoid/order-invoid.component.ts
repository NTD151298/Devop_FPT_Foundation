import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AuthenticationService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-order-invoid',
  templateUrl: './order-invoid.component.html',
  styleUrls: ['./order-invoid.component.css'],
})
export class OrderInvoidComponent implements OnInit {
  @ViewChild('printBtn') printBtn!: ElementRef;

  @Input() modelInvoid: any = {};

  dateInvoid: Date = new Date();

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (this.printBtn) {
      setTimeout(() => {
        this.printBtn.nativeElement.click();
      }, 500);
    }
  }

}
