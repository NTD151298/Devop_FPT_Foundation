import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-close-sale-session',
  templateUrl: './close-sale-session.component.html',
  styleUrls: ['./close-sale-session.component.css']
})
export class CloseSaleSessionComponent implements OnInit {

  modelView: any = {};

  constructor(
    private pOSServices: POSServices,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _toastr: ToastrService,
    private auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.getDetail(this.config.data);
  }

  getDetail(id: number) {
    this.pOSServices.SaleSession().getInfo(id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.modelView = res.data;
        this.modelView.cash = res.data.opening_cash + res.data.closing_cash;
        this.modelView.user = this.auth.currentUserInfoValue;
      } else {
        this._toastr.error(res.message)
      }
    })
  }

  onSaveClick() {
    this.modelView.status = 1;
    this.pOSServices.SaleSession().modify(this.modelView).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.ref.close(res.data);
      } else {
        this._toastr.error(res.message)
      }
    });
  }

  onCloseClick() {
    this.ref.close();
  }

}
