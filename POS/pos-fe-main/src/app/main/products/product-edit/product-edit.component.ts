import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, lastValueFrom } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { form_type } from 'src/services/common/enum';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  id: number;
  item: any = {
    name: '',
    id: 0,
    is_delete: false,
    code: '',
    note: '',
    id_ecom: 0,
    partner_id: 0,
    category_code: '',
    ecom_prartner_id: 0,
    is_active: true,
    barcode: '',
    price: null,
  };
  product_form_dis: boolean = false;
  products: any[] = [];
  partners: any[] = [];
  units: any[] = [];
  packings: any[] = [];
  newItem: any = {};
  listDetai: any[] = [];
  readonly: number = 0;

  constructor(
    private _services: POSServices,
    private _toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private _location: Location,
  ) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = parseInt(params.id);
      this.readonly = parseInt(params.form_type);
      console.log(typeof this.readonly);
      if (this.readonly == form_type.readonly) {
        console.log('vào 1');
        this.product_form_dis = true;
      }
    });
  }

  ngOnInit(): void {
    this.getAllOptions()
  }

  resetNewItem() {
    this.newItem = {
      "id": 0,
      "is_delete": false,
      "product_id": this.id,
      "partner_id": 0,
      "price": 0,
      "unit_code": this.item.unit_code || "",
      "packing_code": this.item.packing_code || "",
      "note": "",
      "product_name": this.item.name || "",
      "partner_name": ""
    }
  }

  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      product = lastValueFrom(this._services.Category().Product().getOpt()),
      partners = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([unit, packing, product, partners]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.packings = mapArrayForDropDown(res[1].data.lists, 'name', 'code');
        this.products = mapArrayForDropDown(res[2].data.lists, 'name', 'code');
        this.partners = mapArrayForDropDown(res[3].data.lists, 'name', 'id');
        this.getDetail(this.id);
        this.load_listDetai();
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

  validate(item) {
    if (!item?.name) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập tên sản phẩm");
      return false;
    }
    if (!item?.barcode) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập mã barcode");
      return false;
    }
    if (!item?.unit_code) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập đơn vị sản phẩm");
      return false;
    }
    if (!item?.packing_code) {
      this._toastr.warning("Thông báo", "Yêu cầu quy cách đóng gói");
      return false;
    }
    return true
  }

  save() {
    if (!this.validate(this.item)) {
      return
    }
    if (this.id == 0) {
      this._services
        .Product()
        .add({ ...this.item, price: this.item.price || 0 })
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.getDetail(this.id);
            this._toastr.success(res.message);
          } else {
            this._toastr.error(res.message);
          }
        });
    } else {
      this._services
        .Product()
        .edit({ ...this.item, price: this.item.price || 0 })
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.getDetail(this.id);
            this._toastr.success(res.message);
          } else {
            this._toastr.error(res.message);
          }
        });
    }
  }

  getDetail(id: number) {
    this._services
      .Product()
      .get(id)
      .subscribe((res: any) => {
        this.item = res.data;
        this.resetNewItem();
      });
  }

  validate_listDetai(item) {
    if (!item?.partner_id) {
      this._toastr.warning("Thông báo", "Yêu cầu chọn nhà cung cấp")
      return false;
    }
    if (!item?.price) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập giá")
      return false;
    }
    return true
  }

  add_listDetai() {
    if (this.validate_listDetai(this.newItem)) {
      this.newItem = {
        ...this.newItem,
        "partner_name": this.partners.find(obj => this.newItem.partner_id == obj.value).label,
        "unit_code": this.item.unit_code || "",
        "packing_code": this.item.packing_code || "",
        "product_name": this.item.name || "",
      }
      this._services
        .Product()
        .add_listDetai(this.newItem)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.resetNewItem();
            this.load_listDetai();
            this._toastr.success(res.message);
          } else {
            this._toastr.error(res.message);
          }
        });
    }
  }

  edit_listDetai(item) {
    if (this.validate_listDetai(item)) {
      item = {
        ...item,
        "partner_name": this.partners.find(obj => item.partner_id == obj.value).label,
        "unit_code": this.item.unit_code || "",
        "packing_code": this.item.packing_code || "",
        "product_name": this.item.name || "",
      }
      this._services
        .Product()
        .edit_listDetai(item)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.load_listDetai();
            this._toastr.success(res.message);
          } else {
            this._toastr.error(res.message);
          }
        });
    }
  }

  delete_listDetai(item) {
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
          item.is_delete = true;
          this._services
            .Product()
            .edit_listDetai(item)
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                this.load_listDetai();
                this._toastr.success(res.message);
              } else {
                this._toastr.error(res.message);
              }
            });
        }
      });
  }

  load_listDetai() {
    this._services
      .Product()
      .get_listDetai(this.id)
      .subscribe(({ data }: any) => {
        this.listDetai = data;
      });
  }

  resetPrice(item) {
    item.price = 0;
  }

  cancel() {
    this._location.back();
  }
}
