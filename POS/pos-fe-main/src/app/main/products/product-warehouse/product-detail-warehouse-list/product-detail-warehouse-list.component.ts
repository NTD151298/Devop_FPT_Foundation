import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom, map } from 'rxjs';
import { ProductViewModel } from 'src/app/models/pos/product';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { ModifyPriceComponent } from '../modify-price/modify-price.component';
import * as XLSX from 'xlsx';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
@Component({
  selector: 'app-product-detail-warehouse-list',
  templateUrl: './product-detail-warehouse-list.component.html',
  styleUrls: ['./product-detail-warehouse-list.component.css'],
  providers: [DialogService],
})
export class ProductDetailWarehouseListComponent implements OnInit {

  @ViewChild('paginator') paginator: any;
  @ViewChild('export') table: ElementRef;
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
  lstPageSize: any = [15, 20, 25, 30];
  listWarehouse: any = [];
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
    private modalService: NgbModal,
    private utils: UltisService,
    private _auth: AuthenticationService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    // let today = new Date();
    // this.filter.start_date = null;
    // this.filter.end_date = null;
    let product_cat = lastValueFrom(
      this._services.Category().Product().getOpt()
    );
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    let partners = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([product_cat, warehouse, partners]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(
        res[0].data.lists,
        'name',
        'code'
      );
      this.listWarehouse = this.utils.genWarehouses(res[1].data);
      this.filter.warehouse_id = this._auth.currentUserWarehouseId;
      this.listPartner = mapArrayForDropDown(res[2].data.lists, 'name', 'id');
      this.getList();
    });
  }
  add() {}
  edit(item: any) {
    const dialogRef = this.modalService.open(ModifyPriceComponent, {
      size: 'lg',
    });
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getList();
      }
    });
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
      warehouse_id: this.filter.warehouse_id || this._auth.currentUserWarehouseId,
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
          element['isWarning'] = this.subtractDays(
            element['warning_date'],
            new Date(element['exp_date'])
          );
        });
        this.paging = {
          ...this.paging,
          pageIndex: data.page,
          TotalItems: data.totalcount,
        };
      });
  }

  subtractDays(numOfDays, date = new Date()) {
    const dateCopy = new Date(date.getTime());

    dateCopy.setDate(dateCopy.getDate() - numOfDays);
    if (dateCopy.getTime() < new Date().getTime()) {
      if (new Date().getTime() > new Date(date).getTime()) {
        return 'danger';
      } else {
        return 'warning';
      }
    }
    return '';
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
  exportExcel() {
    let data = {
      keyword: '',
      category_code: '',
      warehouse_id: this.filter.warehouse_id || 0,
      start_date: null,
      end_date: null,
      partner_id: 0,
      status_price: 0,
      page_size: this.paging.pageSize,
      page_number: 0,
    };
    this._services
      .Product()
      .product_detail_warehouse_list(data)
      .subscribe(({ data }: any) => {
        this.exportData = data.lists.map((ele) => {
          return {
            ...ele,
            barcode: `'${ele.barcode}`,
          };
        });
        setTimeout(() => {
          const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
            this.table.nativeElement
          );
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, `Báo cáo tồn kho.xlsx`);
        }, 500);
      });
  }

  exportExcelScale() {
    let data = {
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',
      warehouse_id: this.filter.warehouse_id || 0,
      partner_id: this.filter.partner_id || 0,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      status_price: 0,
      page_size: this.paging.pageSize,
      page_number: 0,
      is_scale: true,
    };
    this._services
      .Product()
      .product_detail_warehouse_list(data)
      .subscribe(({ data }: any) => {
        this.exportData = data.lists.map((ele) => {
          return {
            ...ele,
            barcode: `'${ele.barcode}`,
          };
        });
        setTimeout(() => {
          const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
            this.table.nativeElement
          );
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, `Dữ liệu cho cân.xlsx`);
        }, 500);
      });
  }
}
