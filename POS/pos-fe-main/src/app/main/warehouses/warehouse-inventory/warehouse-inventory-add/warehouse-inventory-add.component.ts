import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import {
  mapArrayForDropDown,
  validVariable,
} from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-warehouse-inventory-add',
  templateUrl: './warehouse-inventory-add.component.html',
  styleUrls: ['./warehouse-inventory-add.component.css'],
})
export class WarehouseInventoryAddComponent implements OnInit {
  item: any = {
    warehouse_id:0,
    content:'',
    inventory_date:new Date()
  };
  warehouses: any = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _toastr: ToastrService,
    private auth: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.getAllOptions();
  }

  getAllOptions() {
    this.item.warehouse_name = this.auth.currentUserInfoValue.warehouse.name;
    this.item.warehouse_id = this.auth.currentUserInfoValue.warehouse.id;
  }

  validate() {
    let v1 = ['warehouse_id','inventory_date', 'content'];
    let l1 = ['Kho đích','Thời gian kiểm kho', 'Nội dung'];

    for (let i = 0; i < v1.length; i++) {
      if (!validVariable(this.item[v1[i]])) {
        this._toastr.error(`Vui lòng nhập "${l1[i]}" !`);
        return false;
      }
    }
    return true;
  }

  onSaveClick() {
    if (this.validate()) {
      this.ref.close(this.item);
    }
  }

  onCloseClick() {
    this.ref.close();
  }
}
