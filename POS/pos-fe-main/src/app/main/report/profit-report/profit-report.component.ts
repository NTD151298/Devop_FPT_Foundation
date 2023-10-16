import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.css']
})
export class ProfitReportComponent implements OnInit {

  @ViewChild('export') table: ElementRef;
  filter: any = {
    keyword: '',
    category_code: '',
    start_date: this.subtractMonths(1),
    end_date: new Date()
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
    private confirmDialog: ConfirmDialogService,
    private utils: UltisService,
    private auth: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let product_cat = lastValueFrom(this._services.Category().Product().getOpt());
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([product_cat, warehouse]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(res[0].data.lists, 'name', 'code');      
      this.listWarehouse = this.utils.genWarehouses(res[1].data);       
      this.listWarehouse.unshift({
        value: 0,
        label: "Tất cả",
      })
      this.filter.warehouse_id = this.auth.currentUserWarehouseId;
      this.getList();
    })
  }

  getList() {
    let data = {
      warehouse_id: this.filter.warehouse_id || this.auth.currentUserWarehouseId,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',
    }
    this._services.Report().getRevenueProductsList(data).subscribe(({ data }: any) => {
      this.summary = data;
    })
  }

  exportExcel() {
    setTimeout(() => {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Báo cáo doanh thu sản phẩm.xlsx')
    }, 400)
  }

  save() {

  }
  delete() {

  }
  cancel() {

  }
  subtractMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
    return date;
  }

}
