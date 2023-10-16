import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { code_province } from 'src/services/common/conts';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-customer-popup-create',
  templateUrl: './customer-popup-create.component.html',
  styleUrls: ['./customer-popup-create.component.css']
})
export class CustomerPopupCreateComponent implements OnInit {

  modelCustmer: any = {
    Name: '',
    Phone: '',
    Address: '',
  };
  province: any[] = code_province
  constructor(
    private pOSServices: POSServices,
    public ref: DynamicDialogRef,
    public _toastr: ToastrService,
    public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.province = mapArrayForDropDown(this.province, 'name', 'code');
  }

  validate() {
    if (!this.modelCustmer?.province_code) {
      this._toastr.warning("Thông báo", "Yêu cầu chọn tỉnh thành")
      return false
    }
    return true;
  }

  onSaveClick(): void {
    if (this.validate()) {
      var model = {
        name: this.modelCustmer.Name,
        phone: this.modelCustmer.Phone,
        email: '',
        address: this.modelCustmer.Address,
        province_code: this.modelCustmer.province_code,
        code:`S${this.modelCustmer.province_code}KH`
      };
      this.pOSServices.CreateCustomer(model).subscribe((data: any) => {
        if (data.statusCode === 200) {
          if (data.data.name != model.name) {
            this._toastr.error('Số điện thoại đã tồn tại');
            return;
          }
          this._toastr.success('Thêm thành công khách hàng');
          this.ref.close(data);
        } else {
          this._toastr.error(data.message)
        }
      });
    }
  }


  onCloseClick() {
    this.ref.close();
  }

}
