import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-sale-session-start-modal',
  templateUrl: './sale-session-start-modal.component.html',
  styleUrls: ['./sale-session-start-modal.component.css']
})
export class SaleSessionStartModalComponent implements OnInit {
  item: any = {

  };
  listWarehouse:any[] = [];
  loading:boolean=false;
  constructor(protected _auth: AuthenticationService, private _services: POSServices, private _router: Router, private _toastr: ToastrService,private utils: UltisService,) { }

  ngOnInit(): void {
    let userInfo = this._auth.currentUserInfoValue;
    this.item.staff_id = userInfo.id;
    this.item.full_name = userInfo.full_name;
    this.getWarehouse();
  }

  getWarehouse(){
    this._services
      .Warehouse().getOpt()
      .subscribe(({ data }: any) => {
        this.listWarehouse = this.utils.genWarehouses(data);
        this.item.warehouse_id = this._auth.currentUserWarehouseId;
      });
  }
  validate(){
    if (!this.item.warehouse_id || this.item.warehouse_id === 0) {
      this._toastr.error('Vui lòng chọn kho');
      return false;
    }
    return true;
  }

  startSession() {
    if(!this.validate()){
      return;
    }
    this.loading = true;
    this.item.start_time = new Date();
    this.item.end_time = new Date();
    this.item.status = 0;
    this._services.SaleSession().create(this.item).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.loading = false;
        this._toastr.success(res.message);
        this._router.navigate([`/pos/${this.item.warehouse_id}/${res.data}`]);
      } else {
        this._toastr.error(res.message);
        this.loading = false;
      }
    })
  }
  close(){
  }
}
