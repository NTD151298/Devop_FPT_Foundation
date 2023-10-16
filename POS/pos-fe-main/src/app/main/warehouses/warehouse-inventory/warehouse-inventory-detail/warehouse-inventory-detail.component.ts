import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import {
  mapArrayForDropDown,
  validVariable,
} from 'src/services/common/globalfunction';
import { lastValueFrom, Subject } from 'rxjs';
import { statusPurchase } from 'src/app/shared/common/app.constants';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-warehouse-inventory-detail',
  templateUrl: './warehouse-inventory-detail.component.html',
  styleUrls: ['./warehouse-inventory-detail.component.css'],
})
export class WarehouseInventoryDetailComponent implements OnInit {
  item: any = {
    products: [],
    status_id: 0,
    code: '',
    content: '',
    type:0
  };
  _params: any = {};
  disableForm: boolean = false;
  products: any[] = [];
  product_clone: any = [];
  listProductDelete = [];
  listStatus;
  inputChange$ = new Subject();
  filteredProducts: any[] = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _services: POSServices,
    private _toastr: ToastrService,
    private _location: Location,
    private auth: AuthenticationService,
    private shareService: ShareStateService
  ) {}

  ngOnInit(): void {
    this.listStatus = mapArrayForDropDown(statusPurchase, 'name', 'id');
    this._activatedRoute.params.subscribe((params: any) => {
      this.item.id = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.getAllOptions();
    });
  }

  getAllOptions() {
    this.shareService.stateInventory$.subscribe((e: any) => {
      if (e) {
        this.item.content = e.content;
        this.item.warehouse_id = e.warehouse_id;
        this.item.warehouse_name = e.warehouse_name;
        this.item.inventory_date = e.inventory_date;
      } else {
        this.item.id == 0 &&
          this._router.navigate([`main/warehouses/warehouse-inventory`]);
      }
    });
    this.item.id !== 0 && this.getDetail();
  }

  getDetail() {
    this._services
      .WarehouseInventory()
      .get(this.item.id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.item = res.data;
          if (this.item.status_id === 1 || this.item.status_id === 2) {
            this.disableForm = true;
          }
          this.item.products = this.item.products.map((e:any )=> ({
            ...e,
            diff_amount:e.quantity - e.quantity_stock
          }));
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  validate() {
    let v1 = ['warehouse_id', 'status_id', 'content'];
    let l1 = ['Kho đích', 'Trạng thái', 'Nội dung'];
    let v2 = ['product_id', 'quantity'];
    let l2 = ['Sản phẩm', 'Số lượng'];
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
      return false;
    } else {
      for (let i = 0; i < this.item.products.length; i++) {
        for (let j = 0; j < v2.length; j++) {
          if (!validVariable(this.item.products[i][v2[j]])) {
            this._toastr.error(`Vui lòng nhập "${l2[j]}" ở tất cả sản phẩm!`);
            return false;
          }
        }
        this.item.products[i].note = this.item.products[i].note?this.item.products[i].note:'';
      }
    }
    return true;
  }

  save() {
    if (!this.validate()) {
      return;
    }
    if (this.item.id == 0) {
      this.item.products = this.item.products.map((obj: any) => ({
        ...obj,
        id :0,
        products_warehouse_id: obj.id
      }));
      this._services
        .WarehouseInventory()
        .add(this.item)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this._toastr.success(res.message);
            this._location.back();
          } else {
            this._toastr.error(res.message);
          }
        });
    } else {
      if (this.listProductDelete.length > 0) {
        this.listProductDelete.forEach((obj) => {
          this.item.products.push(obj);
        });
      }
      this._services
        .WarehouseInventory()
        .edit(this.item)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this._toastr.success(res.message);
            this._location.back();
          } else {
            this._toastr.error(res.message);
          }
        });
    }
  }

  reject(){
    if (!this.validate()) {
      return;
    }
    if (this.item.id != 0){
      this._services
      .WarehouseInventory()
      .reject(this.item.id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._toastr.success(res.message);
          this._location.back();
        } else {
          this._toastr.error(res.message);
        }
      });
    }
  }
  approve(){
    if (!this.validate()) {
      return;
    }
    if (this.item.id != 0){
      this._services
      .WarehouseInventory()
      .approve(this.item.id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._toastr.success(res.message);
          this._location.back();
        } else {
          this._toastr.error(res.message);
        }
      });
    }
  }

  addProduct(data) {
    var prd = this.item.products.find(
      (x) => x.id == data.id
    );
    if (prd) {
      this._toastr.error(`Sản phẩm đã có trong danh sách!`);
      return;
    }
    this.item.products.unshift({ ...data });
    this.item.ProductBox = null;
  }
  deleteProduct(index) {
    this.listProductDelete.push({
      ...this.item.products[index],
      is_delete: true,
    });
    this.item.products.splice(index, 1);
  }

  keyPressSearchProduct(event: any) {
    let val = event.target.value;
    if (event.keyCode == 13) {
      var modelCode = this.getCodeProductByBarcode(val);
      if (modelCode.isScale) {
        this.getProductBarcode(modelCode);
      } else if (modelCode.quantityScale > 0) {
        this.getProductBarcode(modelCode);
      }
    }
  }
  getCodeProductByBarcode(val: string) {
    if (val && val.startsWith('1') && val.length == 13) {
      return {
        isScale: true,
        quantityScale: parseInt(val.slice(7, 12)) / 1000,
        code: val.slice(1, 7),
      };
    }
    if (val.length == 12 && val.startsWith('0')) {
      return {
        isScale: false,
        quantityScale: 1,
        code: val.slice(1, val.length),
      };
    }
    return {
      isScale: false,
      quantityScale: 1,
      code: val,
    };
  }
  filterProducts(event: any) {
    let query = event.query;
    var modelCode = this.getCodeProductByBarcode(query);
    if (!modelCode.isScale || modelCode.quantityScale == 1) {
      this.getListProduct(query);
    }
  }
  getListProduct(keyword: any) {
    this._services
      .GetListProduct({
        keyword: keyword,
        size: 10,
        currentPage: 1,
        warehouse_id:
          this.item.warehouse_id || this.auth.currentUserWarehouseId,
      })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.filteredProducts = res.data.lists.map((obj: any) => ({
            ...obj,
            nameView: obj.name + ' - ' + obj.barcode,
          }));
        } else {
          //this._toastr.error(res.message);
        }
      });
  }
  getProductBarcode(model: any) {
    this._services
      .GetProductBarcode({
        keyword: model.code,
        warehouse_id:
          this.item.warehouse_id || this.auth.currentUserWarehouseId,
      })
      .subscribe((res: any) => {
        if (res.data) {
          res.data.nameView = res.data.name + ' - ' + res.data.barcode;
          res.data.quantity = model.quantityScale;
          res.data.isScale = model.isScale;
          this.addProduct(res.data);
          this.item.Product = null;
        }
      });
  }
  searchProducts() {
    this.getListProduct(this.item.ProductBox ? this.item.ProductBox : '');
  }
  onSelectProduct() {
    var product = this.filteredProducts.find(
      (x) => x.id == this.item.ProductBox?.id
    );
    if (product) {
      this.addProduct(product);
    }
  }
  changeQuantity(item){
    if (item.quantity) {
      item.diff_amount = item.quantity - item.quantity_stock;
    }
  }

  json: any = [

  ]

  exportExcel() {
    this.item.products.forEach((obj, index) => {
      let data = {
        "STT": index + 1,
        "Sản phẩm": obj.name || "",
        "Mã mua hàng": obj.barcode || "",
        "Mã đơn vị": obj.unit_code || "",
        "Kiểu đóng gói": obj.packing_code || "",
        "Số lượng tồn kho": obj.quantity_stock || 0,
        "Số lượng kiểm kho": obj.quantity || 0,
        "Chênh lệch": obj.diff_amount || 0,
        "Nguyên nhân": obj.note || "",      
      };
      this.json.push(data);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    // **note**
    // s = start, r = row, c=col, e= end
    // merge col & row    
    const merge = [
      { s: { c: 0, r: 0 }, e: { c: 2, r: 0 } },
      { s: { c: 3, r: 0 }, e: { c: 5, r: 0 } },
      { s: { c: 0, r: 1 }, e: { c: 2, r: 1 } },
      { s: { c: 3, r: 1 }, e: { c: 5, r: 1 } },
      { s: { c: 0, r: 2 }, e: { c: 2, r: 2 } },
      { s: { c: 3, r: 2 }, e: { c: 5, r: 2 } },
    ];
    ws["!merges"] = merge;
    ws['!cols'] = [
      { 'width': 6 },
      { 'width': 40 },
      { 'width': 40 },
      { 'width': 40 },
      { 'width': 40 },
    ]
    let today = new Date(this.item.inventory_date);
    let formatToday = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`
    let userUpdated: string = null;

    // if (!!this.itemFileExcel.userUpdated) {

    //   userUpdated = this.userList.find(obj => this.itemFileExcel.userUpdated = obj.id).full_name;
    // }
    // XLSX.utils.sheet_add_aoa(ws, [[`Phiên đối soát:`]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[`Thời gian: ${formatToday}`]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[`Nội dung: ${this.item.content || ""}`]], { origin: 'A2' });  


    // const range = XLSX.utils.decode_range(ws["!ref"] ?? "");
    // const rowCount = range.e.r;
    // const columnCount = range.e.c;

    // for (let row = 0; row <= rowCount; row++) {
    //   for (let col = 0; col <= columnCount; col++) {
    //     const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
    //     // Add center alignment to every cell
    //     ws[cellRef].s = {
    //       alignment: { horizontal: "center" },
    //     };
    //     if (row === 6) {
    //       // Format headers and names
    //       ws[cellRef] = {
    //         ...ws[cellRef].s,
    //         font: { bold: true },
    //       };
    //     }
    //   }
    // }

    // ws["!rows"]. = {									// set the style for target cell
    //   font: {
    //     bold: true,
    //     vertical: "center",
    //     horizontal: "center",
    //   },
    // };

    // ws["A6"] = { // set the style for target cell
    //   font: {      
    //     bold: true,
    //     color: {
    //       rgb: "FFFFAA00"
    //     }
    //   },
    // };

    // add json
    XLSX.utils.sheet_add_json(ws, this.json, { origin: 'A4' });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Phiếu kiểm kho.xlsx`)
  }
}
