import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import { mapArrayForDropDown, validVariable } from 'src/services/common/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
@Component({
  selector: 'app-warehouse-request-detail',
  templateUrl: './warehouse-request-detail.component.html',
  styleUrls: ['./warehouse-request-detail.component.css'],
})
export class WarehouseRequestDetailComponent implements OnInit {
  item: any = {
    products: [],
    status_id: 0,
  };
  disableForm: boolean = false;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _auth: AuthenticationService,
    private _location: Location,
    private utils: UltisService,
    private _services: POSServices
  ) { }
  newProduct: any = {
    id: 0,
    note: ''
  };
  units: any[] = [];
  products: any[] = [];
  product_clone: any[] = [];
  packings: any[] = [];
  warehouses: any[] = [];
  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      this.item.id = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.getAllOptions();
    });
  }
  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      product = lastValueFrom(this._services.Product().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([unit, product, packing, warehouse]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.products = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
        this.packings = mapArrayForDropDown(res[2].data.lists, 'name', 'code');
        this.warehouses = this.utils.genWarehouses(res[3].data);
        this.product_clone = res[1].data.lists;
        this.item.id !== 0 && this.getDetail(this.item.id);
      }
    );
  }

  getDetail(id: string) {
    this._services
      .WarehouseRequest()
      .get(id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.item = res.data;
          this.item.transfer_date = new Date(this.item.transfer_date);
          this.item.products.forEach((obj) => {
            obj.exp_date = new Date(obj.exp_date);
          });
          this.disableForm = this.item.status_id !== 0;
        } else {
          this._toastr.error(res.message);
        }
      });
  }
  addProduct() {
    this.item.products.unshift({ ...this.newProduct });
    this.newProduct = {
      id: 0,
      note: ''
    };
  }
  deleteProduct(index) {
    this.item.products.splice(index, 1);
  }

  validate() {
    let v1 = ['warehouse_id', 'transfer_date', 'content'];
    let l1 = ['Kho nhận hàng', 'Ngày bắt đầu gửi', 'Nội dung'];
    let v2 = [
      'product_id',
      'barcode',
      'quantity',
      'category_unit_code',
      'category_packing_code',
      'exp_date',
    ];
    let l2 = ['Sản phẩm', 'Mã sản phẩm', 'Số lượng', 'Đơn vị', 'Kiểu đóng gói', 'Hạn sử dụng'];
    for (let i = 0; i < v1.length; i++) {
      if (!validVariable(this.item[v1[i]])) {
        this._toastr.error(`Vui lòng nhập "${l1[i]}" !`);
        return false;
      }
    }
    if (
      !validVariable(this.item?.products) ||
      this.item.products.length === 0
    ) {
      this._toastr.error('Vui lòng thêm sản phẩm!');
    } else {
      for (let i = 0; i < this.item.products.length; i++) {
        for (let j = 0; j < v2.length; j++) {
          if (!validVariable(this.item.products[i][v2[j]])) {
            this._toastr.error(`Vui lòng nhập "${l2[j]}" ở tất cả sản phẩm!`);
            return false;
          }
          if (
            this.item.products[i].quantity > this.item.products[i].quantity_max
          ) {
            this._toastr
              .error(`Không nhập số lượng sản phẩm "${this.item.products[i].name}" lớn hơn
            ${this.item.products[i].quantity_max} ! do trong kho không đủ !!`);
            return false;
          }
        }
      }
    }
    return true;
  }

  save() {
    if (!this.validate()) {
      return;
    }
    this.item.partner_id = 0;
    this._services
      .WarehouseRequest()
    [this.item.id === 0 ? 'add' : 'edit'](this.item)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._toastr.success(res.message);
          this._location.back();
        } else {
          this._toastr.error(res.message);
        }
      });
  }
  cancel() {
    this._location.back();
  }

  changeProductId(product) {
    let obj = this.product_clone.find(
      (ele) => ele.id === product.product_id
    );
    if (obj) {
      console.log(obj)
      product.category_packing_code = obj.packing_code;
      product.category_unit_code = obj.unit_code;
      product.batch_number = obj.batch_number;
      product.exp_date = new Date(obj.exp_date ?? new Date());
      product.barcode = obj.barcode;
      product.partner_id = obj.partner_id;
    }
  }
}
