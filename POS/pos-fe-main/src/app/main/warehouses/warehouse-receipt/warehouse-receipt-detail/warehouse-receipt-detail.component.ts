import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { convertDateTimeToUTC, mapArrayForDropDown, validArrayOfVar, validVariable } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { HostListener } from "@angular/core";
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { typeReceipt } from 'src/app/shared/common/app.constants';

@Component({
  selector: 'app-warehouse-receipt-detail',
  templateUrl: './warehouse-receipt-detail.component.html',
  styleUrls: ['./warehouse-receipt-detail.component.scss']
})
export class WarehouseReceiptDetailComponent implements OnInit {
  item: any = {
    products: [],
    status_id: 0,
    barcode: ""
  };
  @ViewChild('export') table: ElementRef;
  newProduct: any = {
    id: 0
  }
  screenWidth: number;
  _params: any = {};
  disableForm: boolean = false;
  units: any[] = [];
  partners: any[] = [];
  products: any[] = [];
  packings: any[] = [];
  warehouses: any[] = [];
  warehouses_copy: any[] = [];
  product_clone: any = [];
  exportData: any = [];
  listProductDelete = [];
  listTypeReceipt: any = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _services: POSServices,
    private _toastr: ToastrService,
    private _location: Location,
    private shareStateService: ShareStateService,
    private utils: UltisService
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      this.item.id = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.item.request_id = !validVariable(params.rq_id) ? 0 : parseInt(params.rq_id);
      this.getAllOptions();
    })
  }
  getAllOptions() {
    this.listTypeReceipt = mapArrayForDropDown(typeReceipt, 'name', 'id');
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      partner = lastValueFrom(this._services.Partner().getOpt()),
      product = lastValueFrom(this._services.Product().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([unit, partner, product, packing, warehouse]).then((res: any) => {
      this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
      this.partners = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
      this.products = mapArrayForDropDown(res[2].data.lists, 'name', 'id');
      this.product_clone = res[2].data.lists;
      this.packings = mapArrayForDropDown(res[3].data.lists, 'name', 'code');
      this.warehouses = this.utils.genWarehouses(res[4].data);
      this.warehouses_copy = res[4].data;
      if (this.item.id === 0) {
        if (this.item.request_id !== 0) {
          this.getWareHouseRequest();
        }
      } else {
        this.getDetail()
      }
    })
  }

  getProductRequestWarehouseList(id) {
    this._services.Product().getProductRequestWarehouseList({ page_size: 10, page_number: 0, keyword: '', warehouse_id: id }).subscribe((res: any) => {
      this.products = mapArrayForDropDown(res.data.lists, 'product_name', 'product_id');
    })
  }

  getDetail() {
    this._services.WarehouseReceipt().get(this.item.id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        res.data.transfer_date = new Date(res.data.transfer_date);
        this.item = res.data;
        if (this.item.status_id !== 0) {
          this.disableForm = true;
        }
        this.item.products.forEach(obj => {
          obj.exp_date = new Date(obj.exp_date);
        })
      } else {
        this._toastr.error(res.message)
      }
    })
  }

  getWareHouseRequest() {
    this._services.WarehouseRequest().get(this.item.request_id).subscribe((res: any) => {
      this.item.partner_id = res.data.partner_id;
      this.item.warehouse_id = res.data.warehouse_id;
      this.item.transfer_date = new Date(res.data.transfer_date);
      this.item.code = res.data.code;
      this.item.delivery_address = res.data.delivery_address;
      this.item.content = res.data.content;
      this.item.products = res.data.products.map(ele => {
        return {
          ...ele,
          exp_date: new Date(ele.exp_date),
          id: 0
        }
      });
    })

  }
  validate() {
    let v1 = ['partner_id', 'warehouse_id', 'transfer_date', 'delivery_address', 'content'];
    let l1 = ['Đối tác', 'Kho đích', 'Ngày bắt đầu gửi', 'Địa chỉ giao', 'Nội dung'];
    // let v2 = ['product_id', 'import_price', 'price', 'quantity', 'category_unit_code', 'category_packing_code', 'exp_date', 'warning_date', 'batch_number'];
    // let l2 = ['Sản phẩm', 'Giá nhập', 'Giá bán', 'Số lượng', 'Đơn vị', 'Kiểu đóng gói', 'Hạn sử dụng', 'Ngày cảnh báo', 'Lô hàng']
    let v2 = ['product_id', 'quantity', 'category_unit_code', 'category_packing_code', 'exp_date', 'warning_date'];
    let l2 = ['Sản phẩm', 'Số lượng', 'Đơn vị', 'Kiểu đóng gói', 'Hạn sử dụng', 'Ngày cảnh báo']
    for (let i = 0; i < v1.length; i++) {
      if (!validVariable(this.item[v1[i]])) {
        this._toastr.error(`Vui lòng nhập "${l1[i]}" !`);
        return false
      }
    }
    if (!validVariable(this.item?.products) || this.item.products.length === 0) {
      this._toastr.error('Vui lòng thêm sản phẩm!')
    }
    else {
      for (let i = 0; i < this.item.products.length; i++) {
        for (let j = 0; j < v2.length; j++) {
          if (!validVariable(this.item.products[i][v2[j]])) {
            this._toastr.error(`Vui lòng nhập "${l2[j]}" ở tất cả sản phẩm!`)
            return false
          }
        }
      }
    }
    return true
  }

  save(status_id) {
    if (this.validate()) {
      this.item.transfer_date = convertDateTimeToUTC(this.item.transfer_date);      
      this.item.products.map(obj => {
        obj.exp_date = convertDateTimeToUTC(obj.exp_date);
      });

      if (this.listProductDelete.length > 0) {
        this.listProductDelete.forEach(obj => {
          this.item.products.push(obj)
        })
      }
      if (this.item.id === 0) {
        let warehouse_code = this.warehouses_copy.find(obj => obj.id == this.item.warehouse_id).code;
        if (this.item.type == 1) {
          this.item.code = `N.${warehouse_code}.`
        }
        else if (this.item.type == 2) {
          this.item.code = `NLC.${warehouse_code}.`
        }
      }
      this._services.WarehouseReceipt()[this.item.id === 0 ? 'add' : 'edit']({ ...this.item, status_id: status_id }).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._toastr.success(res.message);
          this._location.back();
        } else {
          this._toastr.error(res.message);
        }
      })
    }
  }
  changeProductId(product) {
    product.barcode = this.product_clone.find(ele => {
      return ele.id === product.product_id
    })?.barcode;
  }
  addProduct() {
    this.item.products.unshift(JSON.parse(JSON.stringify(this.newProduct)));
    this.newProduct = { id: 0, status_id: 0, barcode: "" };
  }
  deleteProduct(index) {
    this.listProductDelete.push({ ...this.item.products[index], is_delete: true })
    this.item.products.splice(index, 1);
    // this.item.products[index].is_delete = true;
  }
  cancel() {
    this._location.back();
  }

  exportExcel() {
    this._services.WarehouseReceipt().get(this.item.id).subscribe((res: any) => {
      this.exportData = res.data;
      this.exportData.partner_name = this.partners.find(ele => ele.value === this.exportData.partner_id)?.label;
      this.exportData.warehouse_name = this.warehouses.find(ele => ele.value === this.exportData.warehouse_id)?.label;
      this.exportData.products.forEach(prod => {
        prod.unit_name = this.units.find(ele => ele.value === prod.category_unit_code)?.label;
        prod.packing_name = this.packings.find(ele => ele.value === prod.category_packing_code)?.label;
        prod.product_name = this.products.find(ele => ele.value === prod.product_id)?.label;
      });
      setTimeout(() => {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `Phiếu nhập kho - ${this.exportData.code}.xlsx`)
      }, 400)
    })
  }
}
