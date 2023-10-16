import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import * as XLSX from 'xlsx';
import { InventoryHistoryReportComponent } from './inventory-history-report/inventory-history-report.component';

@Component({
  selector: 'app-in-out-inventory-report',
  templateUrl: './in-out-inventory-report.component.html',
  styleUrls: ['./in-out-inventory-report.component.css'],
  providers: [DialogService],
})
export class InOutInventoryReportComponent implements OnInit {
  @ViewChild('export') table: ElementRef;
  @ViewChild('paginator') paginator: any
  filter: any = {
    keyword: '',
    category_code: '',
  }

  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0
  }

  products: any[] = [];
  summary: any = {
    total_voucher: 0,
    total_amount: 0,
    total_sale: 0,
    total_revenue: 0,
  };
  exportData: any = {
    total_voucher: 0,
    total_amount: 0,
    total_sale: 0,
    total_revenue: 0,
  };
  product_categories: any = [];
  listWarehouse: any = [];
  constructor(
    public _services: POSServices,
    public _router: Router,
    private _toastr: ToastrService,
    private auth: AuthenticationService,
    public dialogService: DialogService,
    private utils: UltisService
  ) { }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let product_cat = lastValueFrom(this._services.Category().Product().getOpt());
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([product_cat,warehouse]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
      this.listWarehouse = this.utils.genWarehouses(res[1].data);
      this.filter.warehouse_id = this.auth.currentUserWarehouseId;
      this.getList();
    })
  }

  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging()
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      warehouse_id: this.filter.warehouse_id || this.auth.currentUserWarehouseId,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex
    }
    this._services.Report().getInOutInventoryProducts(data).subscribe(({ data }: any) => {
      this.products = data.lists
      this.paging = {
        ...this.paging,
        pageIndex: data.page,
        TotalItems: data.totalcount
      }
    })
  }
  resetPaging() {
    this.paginator.changePage(0);
    this.paging =
    {
      ...this.paging,
      pageIndex: 1,
      TotalItems: 0
    }
  }
  refreshFilter() {
    this.filter.keyword = '';
    this.getList(true);
  }

  exportExcel() {
    setTimeout(()=>{
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Báo cáo xuât nhập tồn.xlsx')
    },400)
  }

  view(item) {
    const ref = this.dialogService.open(InventoryHistoryReportComponent, {
      width: '80%',
      data: item,
      header:`Lịch sử sản phẩm: ${item.name} (${item.barcode})`
    });
    ref.onClose.subscribe((datas: any) => {
      console.log(datas);
    });
  }
  delete() {

  }
  cancel() {

  }

}
