import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { typeReceipt } from 'src/app/shared/common/app.constants';
import { compareDate, convertToDate } from 'src/app/shared/globlafunction';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import * as XLSX from 'xlsx';
import { InventoryHistoryReportComponent } from '../in-out-inventory-report/inventory-history-report/inventory-history-report.component';
@Component({
  selector: 'app-in-out-daily-report',
  templateUrl: './in-out-daily-report.component.html',
  styleUrls: ['./in-out-daily-report.component.css']
})
export class InOutDailyReportComponent implements OnInit {

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
  typeReportDaily: any = [
    { value: 0, label: "Nhập" },
    { value: 1, label: "Xuất" },
  ];
  listWarehouse: any = [];
  listTypeReceipt: any = [];
  listTypeExport: any = [{
    value: 0,
    label: 'Xuất bán siêu thị',
  },
  {
    value: 1,
    label: 'Xuất trả nhà cùng cấp',
  },
  {
    value: 2,
    label: 'Xuất kho huỷ',
  },
  {
    value: 3,
    label: 'Xuất kho luân chuyển',
  }
  ];
  constructor(
    public _services: POSServices,
    public _router: Router,
    private toast: ToastrService,
    private auth: AuthenticationService,
    // public dialogService: DialogService,
    private utils: UltisService
  ) { }

  ngOnInit(): void {
    this.filter.warehouse_id = 0;
    this.filter.type = 0;
    this.filter.start_date = new Date();
    this.filter.end_date = new Date();
    this.getOptions();
  }
  getOptions() {
    this.listTypeReceipt = mapArrayForDropDown(typeReceipt, 'name', 'id');
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([warehouse]).then((res: any[]) => {
      this.listWarehouse = this.utils.genWarehouses(res[0].data);
      this.filter.warehouse_id = this.auth.currentUserWarehouseId;
      this.getList();
    })
  }

  changeImportExport() {
    this.filter.type = 0;
    this.getList(true);
  }

  getList(reset?: any, event?: any) {
    this.products = [];
    let let_start_date: Date;
    let start_date: any;
    let let_end_date: Date;
    let end_date: any;

    if (!!this.filter.start_date) {
      let_start_date = JSON.parse(JSON.stringify(this.filter.start_date));
      let_start_date = new Date(let_start_date);
      let_start_date.setHours(15, 0, 0, 0);
      start_date = new Date(let_start_date);
      start_date.setUTCHours(0, 0, 0, 0);
    }
    if (!!this.filter.end_date) {
      let_end_date = JSON.parse(JSON.stringify(this.filter.end_date));
      let_end_date = new Date(let_end_date);
      let_end_date.setHours(15, 0, 0, 0);
      end_date = new Date(let_end_date);
      end_date.setUTCHours(0, 0, 0, 0);
    }
    if (this.filter?.warehouse_id) {
      this.filter.warehouse_name = this.listWarehouse.find(obj => this.filter.warehouse_id == obj.value).label;
    }
    // if (reset) {
    //   this.resetPaging()
    // }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    if (this.filter.type_importexport == 0) {
      this._services.Report().getDailyImportPproduct((!!start_date) ? start_date.toISOString() : null, (!!end_date) ? end_date.toISOString() : null, this.filter.warehouse_id || 0, this.filter.type || 0).subscribe(({ data }: any) => {
        this.products = data
        // this.paging = {
        //   ...this.paging,
        //   pageIndex: data.page,
        //   TotalItems: data.totalcount
        // }
      })
    }
    else {
      this._services.Report().getDailyExportPproduct((!!start_date) ? start_date.toISOString() : null, (!!end_date) ? end_date.toISOString() : null, this.filter.warehouse_id || 0, this.filter.type || 0).subscribe(({ data }: any) => {
        this.products = data
        // this.paging = {
        //   ...this.paging,
        //   pageIndex: data.page,
        //   TotalItems: data.totalcount
        // }
      })
    }
  }
  // resetPaging() {
  //   this.paginator.changePage(0);
  //   this.paging =
  //   {
  //     ...this.paging,
  //     pageIndex: 1,
  //     TotalItems: 0
  //   }
  // }
  refreshFilter() {
    this.filter.keyword = '';
    this.getList(true);
  }

  exportExcel() {
    setTimeout(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `Báo cáo ${this.filter.type == 0 ? "nhập" : "xuất"} ngày.xlsx`)
    }, 400)
  }

  compareDate(start_date, end_date) {
    if (!compareDate(start_date, end_date)) {
      this.toast.warning("Thời gian bắt đầu không được lớn hơn thời gian kết thúc");
    }
  }

  view(item) {
    // const ref = this.dialogService.open(InventoryHistoryReportComponent, {
    //   width: '80%',
    //   data: item,
    //   header: `Lịch sử sản phẩm: ${item.name} (${item.barcode})`
    // });
    // ref.onClose.subscribe((datas: any) => {
    //   console.log(datas);
    // });
  }
  delete() {

  }
  cancel() {

  }

}
