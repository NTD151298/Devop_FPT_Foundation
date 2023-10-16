import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { validVariable } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-inventory-history-report',
  templateUrl: './inventory-history-report.component.html',
  styleUrls: ['./inventory-history-report.component.css'],
})
export class InventoryHistoryReportComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  filter: any = {
    keyword: '',
    category_code: '',
  };

  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };
  lists: any = [];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _services: POSServices,
    private _toastr: ToastrService,
    private _auth: AuthenticationService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      warehouse_id:
      this.config.data?.warehouse_id || 0,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      keyword: this.filter.keyword || '',
      product_id: this.config.data?.product_id || 0,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Report()
      .getInventoryHistoryProduct(data)
      .subscribe(({ data }: any) => {
        this.lists = data.lists;
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

  onCloseClick() {
    this.ref.close();
  }
}
