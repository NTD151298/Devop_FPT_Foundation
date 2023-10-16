import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { POSServices } from 'src/services/pos/pos.service';
import * as XLSX from 'xlsx';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
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
  items: any[] = [];
  exportData: any = [];
  listWarehouse: any = [];
  warehouse_clone: any = [];
  modelInvoid: any;
  disable = false;
  constructor(
    public _services: POSServices,
    public _toastr: ToastrService,
    private _router: Router,
    private auth: AuthenticationService,
    private shareService: ShareStateService,
    private utils: UltisService
  ) {    
    // this.disable = localStorage.getItem('roleName') ? false : true;
    this.shareService.statePageName = 'app-order-list';
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

  detail(item: any) {
    this.shareService.setStatePage({
      filter: this.filter,
      paging: this.paging,
    });
    this._router.navigate([`/main/orders/detail/${item.id}`]);
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
      page_size: this.paging.pageSize,
      warehouse_id: this.filter.warehouse_id || 0,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Order()
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

  addOrder() {
    this._router.navigate(['pos/0']);
  }

  exportExcel() {
    let data = {
      start_date: new Date(this.filter.start_date).toISOString(),
      end_date: new Date(this.filter.end_date).toISOString(),
      keyword: this.filter.keyword || '',
      staff_name: this.filter.name || '',
      page_size: this.paging.pageSize,
      page_number: 0,
    };
    this._services
      .Order()
      .getList(data)
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

  printOrder(id: number) {
    this._services
      .Order()
      .getDetail(id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          let wh = this.warehouse_clone.find(
            (e) => e.id == res.data.warehouse_id
          );
          this.modelInvoid = { ...res.data, address: wh.address };
        } else {
          this._toastr.error(res.message);
        }
      });
  }
}
