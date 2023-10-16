import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-shift-revenue-book-report',
  templateUrl: './shift-revenue-book-report.component.html',
  styleUrls: ['./shift-revenue-book-report.component.css']
})
export class ShiftRevenueBookReportComponent implements OnInit {
  @ViewChild('export') table: ElementRef;
  @ViewChild('paginator') paginator: any
  filter: any = {
    start_date: '',
    end_date: '',
    status_id: 0
  }
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0
  }

  listWarehouse: any = [];
  listPartner: any = [];
  product_categories: any = [];

  listStatus: any = [
    { label: 'Kết thúc', value: 1 },
    { label: 'Đang hoạt động', value: 0 },
  ]
  items: any[] = [];
  constructor(public _services: POSServices, public _toastr: ToastrService, private _router: Router, private utils: UltisService,
    private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.getOptions();
  }

  getOptions() {

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

      let today = new Date();
      this.filter.start_date = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
      this.filter.end_date = new Date(today.getTime() + (15 * 24 * 60 * 60 * 1000));
      this.getList();
    })
  }

  getList(reset?: any, event?: any) {
    // if (reset) {
    //   this.resetPaging()
    // }
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
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data: any = {
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      warehouse_id: this.filter.warehouse_id || 0
    }
    this._services.Report().getSessionExport(data.start_date, data.end_date, data.warehouse_id).subscribe(({ data }: any) => {
      this.items = data    
    })
  }

  refreshFilter() {
    this.filter.keyword = '';
    this.getList(true);
  }

  changeStatus(item: any) {
    this._services.WarehouseRequest().statusModify(item.id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.getList();
        this._toastr.success(res.message)
      } else {
        this._toastr.error(res.message)
      }
    })
  }

  exportExcel() {
    setTimeout(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Báo cáo sổ quỹ theo ca.xlsx')
    }, 400)
  }

}
