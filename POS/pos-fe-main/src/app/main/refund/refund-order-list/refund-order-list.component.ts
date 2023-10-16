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
  selector: 'app-refund-order-list',
  templateUrl: './refund-order-list.component.html',
  styleUrls: ['./refund-order-list.component.css'],
})
export class RefundOrderListComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  @ViewChild('export') table: ElementRef;
  loading = true;
  filter: any = {
    start_date: '',
    end_date: '',
    status_id: 0
  };
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };
  items: any[] = [];
  exportData: any = [];
  listWarehouse: any = [];
  modelInvoid: any;
  disable = false;
  constructor(
    public _services: POSServices,
    public _toastr: ToastrService,
    private auth: AuthenticationService,
    private utils: UltisService,
    private _router: Router
  ) {
    this.disable = localStorage.getItem('roleName') ? false : true;
  }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let today = new Date();
    this.filter.start_date = new Date(
      today.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    this.filter.end_date = today;
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([warehouse]).then((res: any[]) => {
      this.listWarehouse = this.utils.genWarehouses(res[0].data);
      this.filter.warehouse_id = this.auth.currentUserWarehouseId;
      this.getList();
    })
  }


  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      start_date: new Date(this.filter.start_date).toISOString(),
      end_date: new Date(this.filter.end_date).toISOString(),
      // status_id: 10,
      keyword: this.filter.keyword || '',
      staff_name: this.filter.name || '',
      warehouse_id: this.filter.warehouse_id || 0,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Refund()
      .getList(data)
      .subscribe(({ data }: any) => {
        this.items = data.lists;
        this.paging = {
          ...this.paging,
          pageIndex: data.page,
          TotalItems: data.totalcount,
        };
        this.loading = false;
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

  add() {
    this._router.navigate(['main/refund/detail/0']);
  }

  view(id) {
    this._router.navigate(['main/refund/detail/' + id]);
  }

  exportExcel() {
    this._services
      .Order()
      .getList({ page_number: 0 })
      .subscribe(({ data }: any) => {
        this.exportData = data.lists;
        setTimeout(() => {
          const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
            this.table.nativeElement
          );
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, 'Đơn hàng bán.xlsx');
        }, 400);
      });
  }

  printRefund() {

  }

}
