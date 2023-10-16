import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  debounce,
  debounceTime,
  lastValueFrom,
  map,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import {
  validVariable,
  mapArrayForDropDown,
} from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import { statusPurchase } from 'src/app/shared/common/app.constants';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import * as XLSX from 'xlsx';
import { deepCopy } from 'src/app/shared/globlafunction';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.css'],
})
export class PurchaseDetailComponent implements OnInit {
  item: any = {
    products: [],
    status_id: 0,
    code: '',
    note: '',
  };
  newProduct: any = {
    id: 0,
    is_delete: false,
    purchase_id: 0,
    import_price: 0,
    price: 0,
    note: '',
  };
  _params: any = {};
  disableForm: boolean = false;
  units: any[] = [];
  partners: any[] = [];
  products: any[] = [];
  packings: any[] = [];
  warehouses: any[] = [];
  listDetail: any[] = [];
  listProductDelete = [];
  listStatus;
  inputChange$ = new Subject();
  screenWidth: number;
  warehouseRequestCreate: any;
  total_price: number = 0;
  readonly: number = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _services: POSServices,
    private _toastr: ToastrService,
    private utils: UltisService,
    private _location: Location,
    private _auth: AuthenticationService,
    private shareStateService: ShareStateService
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1400) {
      this.shareStateService.updateStateSideBarOption(false);
    }
  }

  ngOnInit(): void {
    this.listStatus = mapArrayForDropDown(statusPurchase, 'name', 'id');
    this._activatedRoute.params.subscribe((params: any) => {
      this.item.id = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.readonly = !validVariable(params.isReadOnly) ? 0 : parseInt(params.isReadOnly);
      this.item.warehouse_request_id = !validVariable(params.wh_id) ? 0 : parseInt(params.wh_id);
      this.getAllOptions();
    });
  }

  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      partner = lastValueFrom(this._services.Partner().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([unit, partner, packing, warehouse]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.partners = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
        this.packings = mapArrayForDropDown(res[2].data.lists, 'name', 'code');
        this.warehouses = this.utils.genWarehouses(res[3].data);
        this.item.warehouse_id = this._auth.currentUserWarehouseId;
        this.item.id === 0 && this.searchPartner();
        this.item.id !== 0 && this.getDetail();
        this.item.warehouse_request_id !== 0 && this.getWarehouseRequestDetail();
      }
    );
  }

  onChangeWarehouse() {
    // this._services
    //   .Product()
    //   .getProductRequestWarehouseList({
    //     page_size: 30,
    //     page_number: 0,
    //     keyword: '',
    //     warehouse_id: this.item.warehouse_id || 0,
    //   })
    //   .subscribe((res: any) => {
    //     if (res.statusCode === 200) {
    //       this.products = res.data.lists.map((e) => ({
    //         label: e.product_name,
    //         value: e.product_id,
    //         product_id: e.product_id,
    //         barcode: e.barcode,
    //         unit_code: e.unit_code,
    //         packing_code: e.packing_code,
    //         quantity_stock: e.quantity_stock,
    //         price: e.price,
    //       }));
    //     } else {
    //       this._toastr.error(res.message);
    //     }
    //   });   
  }

  getWarehouseRequestDetail() {
    // this._services
    //   .WarehouseRequest()
    //   .get(this.item.warehouse_request_id)
    //   .subscribe((res: any) => {
    //     if (res.statusCode === 200) {
    //       this.item = { ...res.data, warehouse_request_id: this.item.warehouse_request_id };
    //       this.warehouseRequestCreate = JSON.parse(JSON.stringify(this.item));
    //       if ((this.item.status_id === 1 || this.item.status_id === 2) && this.item.warehouse_request_id === 0) {
    //         this.disableForm = true;
    //       }
    //       this.searchPartner();
    //       let partnersClone = JSON.parse(JSON.stringify(this.partners));
    //       this.partners = [];

    //       for (let i = 0; i < partnersClone.length; i++) {
    //         for (let j = 0; j < this.item.products.length; j++) {
    //           if (partnersClone[i].value == this.item.products[j].partner_id) {
    //             this.partners.push(partnersClone[i]);
    //             break;
    //           }
    //         }
    //       }

    //       this.item.transfer_date = new Date(this.item.transfer_date);
    //       this.item.products.forEach((obj) => {
    //         obj.exp_date = new Date(obj.exp_date);
    //       });
    //     } else {
    //       this._toastr.error(res.message);
    //     }
    //   });
  }

  getDetail() {
    this._services
      .Purchase()
      .get(this.item.id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.item = res.data;
          if (this.item.status_id === 1 || this.item.status_id === 2) {
            this.disableForm = true;
          }
          this.onChangeWarehouse();
          this.item.transfer_date = new Date(this.item.transfer_date);           
          this.item.products.map(obj => {         
            obj.value = obj.product_id;                         
            obj.label = obj.product_name;               
            if (this.readonly == 0) {
              obj.disabled = (!!obj.barcode) ? false : true;         
            }
            else {
              obj.disabled = true;       
            }                    
          })  
          this.get_total_price();                
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  get_total_price() {
    this.total_price = 0;
    this.total_price = this.item.products.reduce((accumulator, curValue) => {
      return accumulator + (curValue.import_price * curValue.quantity || 0)
    }, 0)
  }

  validate() {
    console.log(this.item.products);
    let v1 = [
      'partner_id',
      'warehouse_id',
      'transfer_date',
      'status_id',
      'content',
    ];
    let l1 = [
      'Đối tác',
      'Kho đích',
      'Ngày bắt đầu gửi',
      'Trạng thái',
      'Nội dung',
    ];
    let v2 = [
      'product_id',
      'quantity',
      'category_unit_code',
      'category_packing_code',
      'import_price',
      'price',      
    ];
    let l2 = [
      'Sản phẩm',
      'Số lượng',
      'Đơn vị',
      'Kiểu đóng gói',
      'Giá nhập',
      'Giá bán',      
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
        }  
        let check_product = this.item.products.filter(
          (e) => e.product_id === this.item.products[i].product_id
        );
        if (check_product.length > 1) {
          this._toastr.error(`Nhập trùng sản phẩm !`);
          return false;
        }
      }
    }
    return true;
  }

  // saveWarehouseRequest() {
  //   let warehouseRequestLocal: any = {};
  //   warehouseRequestLocal.id = 0;
  //   warehouseRequestLocal.code = this.item.code;
  //   warehouseRequestLocal.content = this.item.content;
  //   warehouseRequestLocal.note = this.item.note;
  //   warehouseRequestLocal.warehouse_id = this.item.warehouse_id;
  //   warehouseRequestLocal.warehouse_source_id = 0;
  //   warehouseRequestLocal.transfer_date = this.item.transfer_date;
  //   warehouseRequestLocal.partner_id = this.item.partner_id;
  //   warehouseRequestLocal.status_id = this.item.status_id;
  //   warehouseRequestLocal.products = []
  //   this.item.products.forEach(obj => {
  //     let product: any = {};
  //     product.id = 0;
  //     product.purchase_id = 0;
  //     product.product_id = obj.product_id;
  //     product.quantity = obj.quantity;
  //     product.import_price = obj.import_price;
  //     product.price = obj.price;
  //     product.barcode = obj.barcode;
  //     product.category_unit_code = obj.category_unit_code;
  //     product.category_packing_code = obj.category_packing_code;
  //     product.warehouse_id = obj.warehouse_id;
  //     product.is_weigh = !!obj.weight;
  //     product.note = obj.note;
  //     product.is_delete = false;
  //     warehouseRequestLocal.products.push(product)
  //   })
  //   console.log(warehouseRequestLocal)
  //   if (this.item.warehouse_request_id != 0) {
  //     this._services
  //       .Purchase()
  //       .add(warehouseRequestLocal)
  //       .subscribe((res: any) => {
  //         if (res.statusCode === 200) {
  //           this._toastr.success(res.message);
  //           this._location.back();
  //         } else {
  //           this._toastr.error(res.message);
  //         }
  //       });
  //   }
  // }

  save(status_id) {
    if (this.item.products.length > 0) {
      this.item.products = this.item.products.filter(obj => {
        if (obj.quantity > 0) {
          obj.id = 0;
          return obj
        }
      });
    }
    if (!this.validate()) {
      return;
    }
    // if (this.item.warehouse_request_id) {
    //   this.saveWarehouseRequest();
    //   return;
    // }     
    if (this.item.id == 0) {
      this._services
        .Purchase()
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
      // if (this.listProductDelete.length > 0) {
      //   this.listProductDelete.forEach((obj) => {
      //     this.item.products.push(obj);
      //   });
      // }
      this._services
        .Purchase()
        .edit({ ...this.item, status_id: status_id })
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

  // changeProductId(product) {
  //   if (!product.product_id) {
  //     product.quantity_inventory = 0;
  //     product.category_unit_code = '';
  //     product.category_packing_code = '';
  //     product.barcode = '';
  //     product.price = 0;
  //     return;
  //   }
  //   let check_product = this.item.products.filter(
  //     (e) => e.product_id === product.product_id && e.product_id
  //   );
  //   if (check_product.length > 1) {
  //     this._toastr.error('Sản phẩm đã có trong phiếu!');
  //     product.product_id = null;
  //     return;
  //   }
  //   let warehouse_product = this.products.find(
  //     (e) => e.product_id === product.product_id
  //   );
  //   if (warehouse_product) {
  //     product.quantity_inventory = warehouse_product.quantity_stock;
  //     product.category_unit_code = warehouse_product.unit_code;
  //     product.category_packing_code = warehouse_product.packing_code;
  //     product.barcode = warehouse_product.barcode;
  //     product.price = warehouse_product.price;
  //   } else {
  //     product.quantity_inventory = 0;
  //     product.category_unit_code = '';
  //     product.category_packing_code = '';
  //     product.barcode = '';
  //     product.price = 0;
  //   }
  // }
  cancel() {
    this._location.back();
  }
  // addProduct() {
  //   let check_product = this.item.products.find(
  //     (e) => e.product_id === this.newProduct.product_id && e.product_id
  //   );
  //   if (check_product) {
  //     this._toastr.error('Sản phẩm đã có trong phiếu!');
  //     this.newProduct = {
  //       id: 0,
  //       purchase_id: 0,
  //       import_price: 0,
  //       price: 0,
  //       note: '',
  //     };
  //     return;
  //   }
  //   this.item.products.unshift({ ...this.newProduct });
  //   this.newProduct = {
  //     id: 0,
  //     is_delete: false,
  //     purchase_id: 0,
  //     import_price: 0,
  //     price: 0,
  //     note: '',
  //   };

  //   this.total_price = 0;
  //   this.total_price = this.item.products.reduce((accumulator, curValue) => {
  //     return accumulator + curValue.price
  //   }, 0)
  // }
  // deleteProduct(index) {
  //   this.listProductDelete.push({
  //     ...this.item.products[index],
  //     is_delete: true,
  //   });
  //   this.item.products.splice(index, 1);
  // }

  //#region mới

  json: any = [

  ]

  exportExcel() {
    this.item.products.forEach((obj, index) => {
      if (obj.quantity > 0) {
        let data = {
          "STT": index + 1,
          "Sản phẩm": obj.product_name || "",
          "Mã sản phẩm": obj.barcode || "",
          "Số lượng tồn kho": obj.quantity_inventory || 0,
          "Số lượng mua": obj.quantity || 0,
          "Giá nhập": obj.import_price || 0,
          "Giá bán": obj.price || 0,
          "Mã đơn vị": this.units.find(ele => obj.category_unit_code == ele.value).label || "",
          "Kiểu đóng gói": this.packings.find(ele => obj.category_packing_code == ele.value).label || "",
          "Ghi chú": obj.note || "",
          "SP cân": (obj.is_weigh) ? "có" : "không",
          "Sp khuyến mãi": (obj.is_promotion) ? "có" : "không",
        };
        this.json.push(data);
      }
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
    let today = new Date(this.item.transfer_date);
    let formatToday = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`
    let userUpdated: string = null;

    // if (!!this.itemFileExcel.userUpdated) {

    //   userUpdated = this.userList.find(obj => this.itemFileExcel.userUpdated = obj.id).full_name;
    // }
    // XLSX.utils.sheet_add_aoa(ws, [[`Phiên đối soát:`]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[`Đối tác: ${this.partners.find(ele => this.item.partner_id == ele.value).label || ""}`]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[`Kho đích: ${this.warehouses.find(ele => this.item.warehouse_id == ele.value).label || ""}`]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [[`Nội dung: ${this.item.content}`]], { origin: 'D2' });
    XLSX.utils.sheet_add_aoa(ws, [[`Ngày thực hiện: ${formatToday}`]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [[`Tổng tiền: ${this.total_price}`]], { origin: 'D3' });




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
    XLSX.utils.sheet_add_json(ws, this.json, { origin: 'A6' });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Phiếu mua hàng.xlsx`)
  }

  async searchPartner() {
    if (this.item.partner_id) {
      this.item.products = [];
      this._services
        .Product()
        .get_product_request_warehouse(this.item.partner_id, this.item.warehouse_id || 0)
        .subscribe(({ data }: any) => {
          this.item.products = deepCopy(data);
          this.item.products.map((obj, index) => {
            obj.quantity = 0;
            obj.category_unit_code = obj.unit_code;
            obj.category_packing_code = obj.packing_code;
            obj.quantity_inventory = obj.quantity_stock;           
            if (this.readonly == 0) {
              obj.disabled = (!!obj.barcode) ? false : true;           
            }
            else {
              obj.disabled = true;
            }
          });       
          this.get_total_price();
        });
    }
  }

  //#endregion

}
