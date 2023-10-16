import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { ProductViewModel } from 'src/app/models/pos/product';
import { PrintCodeComponent } from 'src/app/pos/barcode/print-code/print-code.component';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-product-barcode-print',
  templateUrl: './product-barcode-print.component.html',
  styleUrls: ['./product-barcode-print.component.css'],
  providers: [DialogService],
})
export class ProductBarcodePrintComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  filter: any = {
    keyword: '',
    category_code: '',
    status_price: 0,
  };
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };
  products_print: any = [];
  listPartner: any = [];
  products: ProductViewModel[] = [];
  product_categories: any = [];
  listPrint: any = [];
  checkboxAll: boolean = false;
  exportData: any = [];
  list_status_price: any = [
    { value: 0, label: 'Tất cả' },
    { value: 1, label: 'Chưa có giá' },
    { value: 2, label: 'Đã có giá' },
  ];
  constructor(
    public _services: POSServices,
    public _router: Router,
    public dialogService: DialogService,
    private utils: UltisService,
    private toast: ToastrService,
    private auth: AuthenticationService,
    private shareService: ShareStateService
  ) {this.shareService.statePageName = 'app-product-barcode-print';}

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let product_cat = lastValueFrom(
      this._services.Category().Product().getOpt()
    );
    let partners = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([product_cat, partners]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(
        res[0].data.lists,
        'name',
        'code'
      );
      this.listPartner = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
      let stagePage = this.shareService.getStatePage();
      if (stagePage) {
        this.paging = stagePage.paging;
        this.filter = stagePage.filter;
        setTimeout(() => this.paginator.changePage(this.paging.pageIndex -1),100);
      }else{
        this.getList();
      }
    });
  }
  add() {
    this.products_print.unshift(...this.products.filter((e) => e.isCheck));
    this.products = this.products.map((obj: any) => ({
      ...obj,
      isCheck: false,
    }));
    this.checkboxAll = false;
  }

  deleteProduct(item) {
    item.isDelete = true;
    this.products_print = this.products_print.filter((e) => !e.isDelete);
  }

  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',
      warehouse_id: this.auth.currentUserWarehouseId,
      partner_id: this.filter.partner_id || 0,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      status_price: this.filter.status_price,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Product()
      .product_detail_warehouse_list(data)
      .subscribe(({ data }: any) => {
        this.products = data.lists;
        this.products.forEach((element) => {
          element['isCheck'] = false;
        });
        this.paging = {
          ...this.paging,
          pageIndex: data.page,
          TotalItems: data.totalcount,
        };
      });
  }

  resetPaging() {
    this.paginator.changePage(0);
    this.paging = {
      ...this.paging,
      pageIndex: 1,
      TotalItems: 0,
    };
  }
  refreshFilter() {
    this.filter.keyword = '';
    this.getList(true);
  }
  save() {}
  delete(item?: any) {}
  cancel() {}

  showPrintBarcode() {
    if (this.products_print.length > 0) {
      const ref = this.dialogService.open(PrintCodeComponent, {
        header: 'In barcode sản phẩm',
        width: '30%',
        data: this.products_print,
      });
      ref.onClose.subscribe((datas: any) => {
        this.getList();
      });
    } else {
      this.toast.warning('Yêu cầu chọn sản phẩm cân in');
    }
  }

  toggleAllCheckbox(e) {
    if (e.checked) {
      this.products.forEach((obj) => {
        obj['isCheck'] = true;
      });
    } else {
      this.listPrint = [];
      this.products.forEach((obj) => {
        obj['isCheck'] = false;
      });
    }
  }

  selectProduct(item) {
    let obj: any = {};
    obj.id = item.id;
    obj.name = item.name;
    obj.price = item.price;
    obj.barcode = item.barcode;
    obj.exp_date = item.exp_date;
    obj.packing_name = item.packing_name;
    if (item.isCheck) {
      if (!this.listPrint) {
        this.listPrint.push(item);
      } else {
        let duplicateObject: any = this.listPrint.some(
          (obj) => obj.id == item.id
        );
        if (!duplicateObject) {
          this.listPrint.push(item);
          if (this.listPrint.length == this.products.length) {
            this.checkboxAll = true;
          }
        }
      }
    } else {
      this.checkboxAll = false;
      for (let i = 0; i < this.listPrint.length; i++) {
        if (this.listPrint[i].id == item.id) {
          this.listPrint.splice(i, 1);
          break;
        }
      }
    }
  }

  showPrintBarcodePrice() {
    if (this.products_print.length > 0) {
      let dataList = this.products_print.map((e: any,index) => ({
        index: index,
        id:e.id,
        name: e.name,
        barcode: e.barcode,
        price: e.price,
        sale_price: e.sale_price,
        packing_name: e.packing_name,
      }));
      this.shareService.setStatePage({
        filter: this.filter, paging: this.paging
      });
      this.shareService.updateStatePrintTem(dataList);
      this._router.navigate([`list-barcode`]);
    } else {
      this.toast.warning('Yêu cầu chọn sản phẩm cân in');
    }
  }
}
