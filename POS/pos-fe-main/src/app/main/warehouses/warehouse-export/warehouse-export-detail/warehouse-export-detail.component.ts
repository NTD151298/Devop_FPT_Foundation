import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import {
  validVariable,
  mapArrayForDropDown,
} from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
@Component({
  selector: 'app-warehouse-export-detail',
  templateUrl: './warehouse-export-detail.component.html',
  styleUrls: ['./warehouse-export-detail.component.css'],
})
export class WarehouseExportDetailComponent implements OnInit {
  item: any = {
    products: [],
    status_id: 0,
  };
  newProduct: any = {
    id: 0,
  };
  _params: any = {};
  disableForm: boolean = false;
  units: any[] = [];
  partners: any[] = [];
  products: any[] = [];
  packings: any[] = [];
  warehouses: any[] = [];
  warehouses_clone: any[] = [];
  product_clone: any = [];
  warehouse_current: any = this._auth.currentUserInfoValue.warehouse?.name;
  screenWidth: number;
  warehouseRequestCreate: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _services: POSServices,
    private _toastr: ToastrService,
    private _location: Location,
    private _auth: AuthenticationService,
    private utils: UltisService,
    private shareStateService: ShareStateService,
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1400) {
      this.shareStateService.updateStateSideBarOption(false)
    }
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      this.item.id = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.item.type = !validVariable(params.type) ? 0 : parseInt(params.type);
      this.item.warehouse_request_id = !validVariable(params.warehouse_request_id) ? 0 : parseInt(params.warehouse_request_id);
      this.getAllOptions();
    });
  }
  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      partner = lastValueFrom(this._services.Partner().getOpt()),
      product = lastValueFrom(
        this._services.GetListProduct({
          keyword: '',
          size: 10,
          currentPage: 0,
          warehouse_id: this._auth.currentUserWarehouseId || 0,
        })
      ),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([unit, partner, packing, warehouse]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.partners = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
        this.packings = mapArrayForDropDown(res[2].data.lists, 'name', 'code');
        this.warehouses_clone = res[3].data;
        this.warehouses = this.utils.genWarehouses(res[3].data);
        this.item.id == 0 && this.getProductWarehouse();
        this.item.id > 0 && this.getDetail();
        this.item.warehouse_request_id !== 0 && this.getWarehouseRequestDetail(this.item.warehouse_request_id);
      }
    );
  }

  getWarehouseRequestDetail(id: string) {
    this._services
      .WarehouseRequest()
      .get(id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.item = { ...res.data, warehouse_request_id: this.item.warehouse_request_id };
          if ((this.item.status_id === 1 || this.item.status_id === 2) && this.item.warehouse_request_id === 0) {
            this.disableForm = true;
          }
          this.getProductWarehouse();
          this.item.export_date = new Date(this.item.export_date);

          let partnersClone = JSON.parse(JSON.stringify(this.partners));
          this.partners = [];
          for (let i = 0; i < partnersClone.length; i++) {
            for (let j = 0; j < this.item.products.length; j++) {
              if (partnersClone[i].value == this.item.products[j].partner_id) {
                this.partners.push(partnersClone[i]);
                break;
              }
            }
          }
          this.item.products.forEach(obj => {
            obj.unit_code = obj.category_unit_code;
            obj.packing_code = obj.category_packing_code;
            obj.products_warehouse_id = obj.id
          })
          this.item.export_date = new Date();

          this.warehouseRequestCreate = JSON.parse(JSON.stringify(this.item));
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  searchPartner(partner_id) {
    if (partner_id) {
      this.item.products = [];
      if(this.warehouseRequestCreate?.products){
        this.warehouseRequestCreate.products.forEach(obj => {
          if (obj.partner_id == partner_id) {
            this.item.products.push(obj)
          }
        })
      }      
    }
  }

  getProductWarehouse() {
    this._services
      .GetListProduct({
        keyword: '',
        size: 10,
        currentPage: 0,
        warehouse_id: this.item.warehouse_id || this._auth.currentUserWarehouseId,
      })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.products = mapArrayForDropDown(res.data.lists, 'name', 'id');
          this.product_clone = res.data.lists;
          this.item.products.forEach((obj) => {
            obj.exp_date = new Date(obj.exp_date);
            let s = this.product_clone.find(
              (ele) => ele.id === obj.products_warehouse_id
            );
            obj.name = s.name;
            obj.quantity_max = s ? s.quantity_stock : obj.quantity;
          });
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  getDetail() {
    this._services
      .WarehouseExport()
      .get(this.item.id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.item = res.data;
          if (this.item.status_id === 1 || this.item.status_id === 2) {
            this.disableForm = true;
          }
          this.getProductWarehouse();
          this.item.export_date = new Date(this.item.export_date);
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  validate() {
    let v1 = [
      'partner_id',
      'warehouse_id',
      'warehouse_destination_id',
      'export_date',
      'source_address',
      'content',
    ];
    let l1 = [
      'Đối tác',
      'Kho nguồn',
      'Kho đích',
      'Ngày bắt đầu gửi',
      'Địa chỉ giao',
      'Nội dung',
    ];
    let v2 = [
      'products_warehouse_id',
      'quantity',
      'unit_code',
      'packing_code',
      'exp_date',
      'warning_date',
    ];
    let l2 = [
      'Sản phẩm',
      'Số lượng',
      'Đơn vị',
      'Kiểu đóng gói',
      'Hạn sử dụng',
      'Ngày cảnh báo',
    ];
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
  saveWarehouseRequest() {
    let warehouseRequestLocal: any = {};
    warehouseRequestLocal.id = 0;
    warehouseRequestLocal.is_delete = false;
    warehouseRequestLocal.export_id = 0;
    warehouseRequestLocal.partner_id = this.item.partner_id;
    warehouseRequestLocal.code = this.item.code;
    warehouseRequestLocal.warehouse_id = this.item.warehouse_id;
    warehouseRequestLocal.note = this.item.note;
    warehouseRequestLocal.content = this.item.content;
    warehouseRequestLocal.export_date = this.item.export_date;
    warehouseRequestLocal.source_address = this.item.source_address;
    warehouseRequestLocal.status_id = 0;
    warehouseRequestLocal.type = this.item.type;
    warehouseRequestLocal.customer_id = 0;
    warehouseRequestLocal.warehouse_destination_id = this.item.warehouse_destination_id;
    warehouseRequestLocal.products = []
    this.item.products.forEach(obj => {
      let product: any = {};
      product.id = 0;
      product.is_delete = false;
      product.products_warehouse_id = obj.warehouse_destination_id;
      product.partner_id = obj.partner_id;
      product.export_id = obj.export_id;
      product.product_id = obj.product_id;
      product.quantity = obj.quantity;
      product.import_price = obj.import_price;
      product.price = obj.price;
      product.unit_code = obj.unit_code;
      product.packing_code = obj.packing_code;
      product.warehouse_id = obj.warehouse_id;
      product.note = obj.note;
      product.exp_date = obj.exp_date;
      product.warning_date = obj.warning_date;
      product.batch_number = obj.batch_number;
      product.barcode = obj.barcode;
      product.is_weigh = !!obj.is_weigh;
      product.is_promotion = obj.is_promotion;
      warehouseRequestLocal.products.push(product)
    })
    console.log(warehouseRequestLocal)
    if (this.item.warehouse_request_id != 0) {
      this._services
        .WarehouseExport()
        .add(warehouseRequestLocal)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this._toastr.success(res.message);
            // this._location.back();
          } else {
            this._toastr.error(res.message);
          }
        });
    }
  }

  save() {
    if (this.item.type == 1 || this.item.type == 2) {//trả nhà cc và hủy
      this.item.warehouse_destination_id = 0;
      //this.item.warehouse_id = this._auth.currentUserWarehouseId;
    }
    if (this.item.type == 2 || this.item.type == 3) {
      this.item.partner_id = 0;
    }
    this.item.source_address = this.item.source_address ? this.item.source_address : (this.item.type == 1 ? 'Xuất trả NCC' : 'Xuất hủy');
    if (!this.validate()) {
      return;
    }
    if (this.item.warehouse_request_id) {
      this.saveWarehouseRequest();
      return;
    }
    if (this.item.id === 0) {
      let warehouse_code = this.warehouses_clone.find(obj => obj.id == this.item.warehouse_id).code;
      // xuất trả ncc
      if (this.item.type == 1) { 
        this.item.code = `XT.${warehouse_code}.`
      }
      // xuất huỷ
      else if (this.item.type == 2) {
        this.item.code = `X.${warehouse_code}.`
      }
      // xuất luân chuyển
      else if (this.item.type == 3) {
        this.item.code = `XLC.${warehouse_code}.`
      }
    }
    this._services
      .WarehouseExport()
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
  changeProductId(product) {
    let obj = this.product_clone.find(
      (ele) => ele.id === product.products_warehouse_id
    );   
    if (obj) {
      product.products_warehouse_id = obj.id;
      product.product_id = obj.product_id;
      product.quantity = obj.quantity_stock;
      product.import_price = obj.import_price;
      product.price = this.item.type == 1 ? obj.import_price : obj.price;
      product.packing_code = obj.packing_code;
      product.unit_code = obj.unit_code;
      product.warehouse_id = obj.warehouse_id;
      product.batch_number = obj.batch_number;
      product.warning_date = obj.warning_date;
      product.exp_date = new Date(obj.exp_date);
      product.barcode = obj.barcode;
      product.is_weigh = obj.is_weigh;
      product.quantity_max = obj.quantity_stock;
      product.name = obj.name;
    }
  }

  searchBarcode(product) {
    let obj = this.product_clone.find(
      (ele) => ele.barcode === product.barcode
    );
    if (obj) {
      product.products_warehouse_id = obj.id;
      product.product_id = obj.product_id;
      product.quantity = obj.quantity_stock;
      product.import_price = obj.import_price;
      product.price = this.item.type == 1 ? obj.import_price : obj.price;
      product.packing_code = obj.packing_code;
      product.unit_code = obj.unit_code;
      product.warehouse_id = obj.warehouse_id;
      product.batch_number = obj.batch_number;
      product.warning_date = obj.warning_date;
      product.exp_date = new Date(obj.exp_date);
      product.barcode = obj.barcode;
      product.is_weigh = obj.is_weigh;
      product.quantity_max = obj.quantity_stock;
      product.name = obj.name;
      this.addProduct();
    }
  }

  addProduct() {
    this.item.products.unshift({ ...this.newProduct });
    this.newProduct = { id: 0 };
  }
  deleteProduct(index) {
    this.item.products.splice(index, 1);
  }

  cancel() {
    this._location.back();
  }
}
