import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { POSServices } from 'src/services/pos/pos.service';
import * as XLSX from 'xlsx';
import { lastValueFrom } from 'rxjs';
import { convertToDate, formatLocaleDateString } from 'src/app/shared/globlafunction';
import { payment_type } from 'src/services/common/enum';

@Component({
  selector: 'app-revenue-book-report',
  templateUrl: './revenue-book-report.component.html',
  styleUrls: ['./revenue-book-report.component.css']
})
export class RevenueBookReportComponent implements OnInit {

  @ViewChild('paginator') paginator: any;
  @ViewChild('export') table: ElementRef;
  loading = true;
  filter: any = {
    start_date: '',
    end_date: '',
    status_id: 0,
  };
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };
  items: any = {};
  exportData: any = [];
  listWarehouse: any = [];
  warehouse_clone: any = [];
  constructor(
    public _services: POSServices,
    public _toastr: ToastrService,
    private _router: Router,
    private auth: AuthenticationService,
    private shareService: ShareStateService,
    private utils: UltisService
  ) {

  }

  ngOnInit(): void {
    this.items.details = [];
    this.getOptions();
  }
  getOptions() {
    let today = new Date();
    this.filter.start_date = new Date(
      today.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    this.filter.end_date = today;
    let stagePage = this.shareService.getStatePage();
    if (stagePage) {
      this.paging = stagePage.paging;
      this.filter = stagePage.filter;
      setTimeout(
        () => this.paginator.changePage(this.paging.pageIndex - 1),
        100
      );
    } else {
      let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
      Promise.all([warehouse]).then((res: any[]) => {
        this.listWarehouse = this.utils.genWarehouses(res[0].data);
        this.warehouse_clone = res[0].data;
        this.filter.warehouse_id = this.auth.currentUserWarehouseId;
        this.getList();
      });
    }
  }

  getList(reset?: any, event?: any) {
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
    this._services.Report().getOrderExport((!!start_date) ? start_date.toJSON() : null, (!!end_date) ? end_date.toJSON() : null, this.filter.warehouse_id || 0).subscribe(({ data }: any) => {
      this.items.details = [];
      this.items = data;
      this.loading = false;
    })
  }

  refreshFilter() {
    this.filter.keyword = '';
    this.getList(true);
  }

  json: any = [

  ]

  exportExcel() {
    let total_amount: number = 0;
    this.items.details.forEach((obj, index) => {
      total_amount += obj.product_total_cost;
      let data = {
        "STT": index + 1,
        "Mã kho": obj.warehouse_code || "",
        "Tên kho": obj.warehouse_name || "",
        "Ngày chứng từ": formatLocaleDateString(convertToDate(obj.date)) || "",
        "Mã chứng từ": obj.code || "",
        "Mã khách hàng": obj.customer_code || "",
        "Tên khách hàng": obj.customer_name || "",
        "Tổng tiền hàng": obj.product_total_cost || 0,
        "Tổng tiền giảm qua sản phẩm": obj.sale_cost || 0,
        "Tổng tiền giảm qua voucher": obj.voucher_cost || 0,
        "Tiền mặt": obj.payment_type == payment_type.cash ? obj.total_amount : 0,
        "Quẹt thẻ": obj.payment_type == payment_type.pos ? obj.total_amount : 0,
        "Chuyển khoản": obj.payment_type == payment_type.bank ? obj.total_amount : 0,
        "Ví momo": obj.payment_type == payment_type.momo ? obj.total_amount : 0,
      };
      this.json.push(data);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    // **note**
    // s = start, r = row, c=col, e= end
    // merge col & row    
    const merge = [
      { s: { c: 0, r: 0 }, e: { c: 13, r: 0 } },
      { s: { c: 11, r: 1 }, e: { c: 13, r: 1 } },
      { s: { c: 11, r: 2 }, e: { c: 13, r: 2 } },
      { s: { c: 11, r: 3 }, e: { c: 13, r: 3 } },
    ];
    ws["!merges"] = merge;
    // ws['!cols'] = [
    //   { 'width': 6 },
    //   { 'width': 40 },
    //   { 'width': 40 },
    //   { 'width': 40 },
    //   { 'width': 40 },
    // ]
    let start_date: Date = convertToDate(this.filter.start_date);
    let end_date: Date = convertToDate(this.filter.end_date);


    XLSX.utils.sheet_add_aoa(ws, [[`Từ ngày ${formatLocaleDateString(start_date)} đến ngày ${formatLocaleDateString(end_date)}`]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[`Dư đầu kỳ: ${this.items.opening_cash}`]], { origin: 'L2' });
    XLSX.utils.sheet_add_aoa(ws, [[`Tồn Trong Kỳ: ${this.items.closing_cash}`]], { origin: 'L3' });
    XLSX.utils.sheet_add_aoa(ws, [[`Dư cuối kỳ: ${this.items.session_cash}`]], { origin: 'L4' });

    // add json
    XLSX.utils.sheet_add_json(ws, this.json, { origin: 'A5' });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Sổ quỹ doanh thu.xlsx`)
  }

}
