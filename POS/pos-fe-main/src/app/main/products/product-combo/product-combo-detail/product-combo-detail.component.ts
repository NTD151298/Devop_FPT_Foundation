import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, lastValueFrom } from 'rxjs';  
import { deepCopy } from 'src/app/shared/globlafunction';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-product-combo-detail',
  templateUrl: './product-combo-detail.component.html',
  styleUrls: ['./product-combo-detail.component.css']
})
export class ProductComboDetailComponent implements OnInit {

  id: number;
  test: boolean = false;   
  item: any = {
    name: '',
    id: 0,
    is_delete: false,
    code: '',
    note: '',
    partner_id: 0,
    category_code: '',
    is_active: true,
    barcode: '',
    unit_code: "",
    packing_code: "",
    price: 0,
    childs: [],
  };
  product_form_dis: boolean = false;
  products: any[] = [];
  industry: any[] = [];
  units: any[] = [];
  packings: any[] = [];
  newItem: any = {};
  listDetai: any[] = [];

  constructor(
    private _services: POSServices,
    private _toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private _location: Location,
  ) {
    this.activatedRoute.params.subscribe((params: any) => { 
      this.id = parseInt(params.id);
    });
  }

  ngOnInit(): void {
    this.test = true
    this.getAllOptions()
  }

  resetNewItem() {
    this.newItem =
    {
      "id": 0,
      "combo_id": this.id,
      "is_delete": false,
      "parent_name": this.item.name,
      "product_id": 0,
      "product_name": "",
      "product_quantity": 0,
      "unit_code": this.item.unit_code || "",
      "packing_code": this.item.packing_code || "",
      "note": "",
    }
  }

  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      industry = lastValueFrom(this._services.Category().Product().getOpt()),
      data = {
        keyword: '',
        category_code: '',
        page_size: 20,
        page_number: 0,
      },
      product = lastValueFrom(this._services.Product().getList(data));
    Promise.all([unit, packing, industry, product]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.packings = mapArrayForDropDown(res[1].data.lists, 'name', 'code');
        this.industry = mapArrayForDropDown(res[2].data.lists, 'name', 'code');
        this.products = mapArrayForDropDown(res[3].data.lists, 'name', 'id');
        if (!!this.id) {
          this.getDetail();
        }
      }
    );
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getDetail() {
    this._services
      .Product()
      .get_combo_detail(this.id)          
      .subscribe((res: any) => {
        this.item = res.data;
        this.resetNewItem();
      });
  }

  validate_listDetai(item) {
    if (!item?.product_id) {
      this._toastr.warning("Thông báo", "Yêu cầu chọn sản phẩm")
      return false;
    }
    if (!item?.product_quantity) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập số lượng")
      return false;
    }
    return true
  }

  validate(item) {    
    if(!item?.unit_code){   
      this._toastr.warning("Thông báo","Yêu cầu nhập đơn vị sản phẩm");
      return false;   
    }
    if(!item?.packing_code){
      this._toastr.warning("Thông báo","Yêu cầu quy cách đóng gói");
      return false;   
    }
    return true
  }

  save() {
    if (!this.validate(this.item)) {   
      return
    }   
    this.item.childs.map(obj => {
      let item = this.products.find(ele => ele.value == obj.product_id);
      obj.parent_name = this.item.name;
      obj.product_name = item.label;
      obj.unit_code = item.unit_code;
      obj.packing_code = item.packing_code;
    })
    if (!this.id) {
      this._services
        .Product()
        .add_product_combo(this.item)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.cancel();
            this._toastr.success(res.message);
          } else {
            this._toastr.error(res.message);
          }
        });
    }
    else {
      this._services
        .Product()
        .edit_product_combo(this.item)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.getDetail();
            this._toastr.success(res.message);
          } else {
            this._toastr.error(res.message);
          }
        });
    }
  }

  add_listDetai() {
    if (this.validate_listDetai(this.newItem)) {
      this.newItem = {
        ...this.newItem,
        "product_name": this.products.find(obj => obj.value == this.newItem.product_id).label,
        "unit_code": this.item.unit_code || "",
        "packing_code": this.item.packing_code || "",
      }
      this.item.childs.push(this.newItem);
      this.resetNewItem();
    }
  }

  // edit_listDetai(item) {
  //   if (this.validate_listDetai(item)) {
  //     item = {
  //       ...item,
  //       "product_name": this.products.find(obj => obj.value == item.product_id).label,
  //     }     
  //   }
  // }

  delete_listDetai(item, index) {
    this.confirmDialog
      .confirm(
        '',
        `Bạn có thực sự muốn xóa bản ghi này ?`,
        'Xác nhận',
        'Huỷ',
        'md'
      )
      .then((confirmed) => {
        if (confirmed) {
          if (!!item.id) {
            item.is_delete = true;
          }
          else {
            this.item.childs.splice(index, 1);
          }
        }
      });
  }

  resetItemDetai(item) {
    item.product_quantity = 0;
    item.note = "";
  }

  cancel() {
    this._location.back();
  }

}
