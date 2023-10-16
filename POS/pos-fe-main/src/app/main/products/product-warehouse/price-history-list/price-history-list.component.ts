import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-price-history-list',
  templateUrl: './price-history-list.component.html',
  styleUrls: ['./price-history-list.component.css'],
})
export class PriceHistoryListComponent implements OnInit {
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
  listWarehouse: any = [];
  dataList: any = [];

  constructor(
    public _services: POSServices,
    public _router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([warehouse]).then((res: any[]) => {
      this.listWarehouse = mapArrayForDropDown(res[0].data, 'name', 'id');
      this.getList();
    });
  }
  add() {}
  edit(item: any) {}
  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      keyword: this.filter.keyword || '',
      warehouse_id: this.filter.warehouse_id || 0,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Product()
      .product_change_price_history_list(data)
      .subscribe(({ data }: any) => {
        this.dataList = data.lists;
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
}
