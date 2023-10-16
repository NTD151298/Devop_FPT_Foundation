import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { list_payment_type } from 'src/services/common/conts';

@Component({
  selector: 'app-pos-invoid',
  templateUrl: './pos-invoid.component.html',
  styleUrls: ['./pos-invoid.component.css']
})
export class PosInvoidComponent implements OnInit {

  @Input() modelInvoid: any = {};

  dateInvoid: Date = new Date();

  ngOnInit(): void {
 
  }

}
