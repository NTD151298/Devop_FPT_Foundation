import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-warehouse-request-list',
  templateUrl: './warehouse-request-list.component.html',
  styleUrls: ['./warehouse-request-list.component.css'],
})
export class WarehouseRequestListComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
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
  listWarehouse: any = [];
  listPartner: any = [];
  constructor(
    public _services: POSServices,
    public _toastr: ToastrService,
    private _router: Router,
    private _auth: AuthenticationService,
    private shareService: ShareStateService,
    private utils: UltisService,
    private confirmDialog: ConfirmDialogService
  ) {
    this.shareService.statePageName = 'app-warehouse-request-list';
  }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let today = new Date();
    this.filter.start_date = new Date(
      today.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    this.filter.end_date = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    let partner = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([warehouse, partner]).then((res: any) => {
      this.listWarehouse = this.utils.genWarehouses(res[0].data);
      this.filter.warehouse_id = this._auth.currentUserWarehouseId;
      this.listPartner = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
      let stagePage = this.shareService.getStatePage();
      if (stagePage) {
        this.paging = stagePage.paging;
        this.filter = stagePage.filter;
        setTimeout(
          () => this.paginator.changePage(this.paging.pageIndex - 1),
          100
        );
      } else {
        this.getList();
      }
    });
  }
  add() {
    this._router.navigate([`main/warehouses/warehouse-request/detail/0`]);
  }
  detail(item: any) {
    this.shareService.setStatePage({
      filter: this.filter,
      paging: this.paging,
    });
    this._router.navigate([`/main/warehouses/warehouse-request/detail/${item.id}`]);
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
      warehouse_id: this.filter.warehouse_id || this._auth.currentUserWarehouseId,
      status_id: 10,
      keyword: this.filter.keyword || '',
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .WarehouseRequest()
      .getList(data)
      .subscribe(({ data }: any) => {
        this.items = data.lists;
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

  changeStatus(item: any, status_id) {
    this.confirmDialog
      .confirm(
        '',
        `Bạn có thực sự muốn ${
          status_id === 1
            ? 'chấp thuận yêu cầu nhập kho này'
            : 'chuyển trạng thái sang Đã hoàn thành'
        } ?`,
        'Xác nhận',
        'Huỷ',
        'md'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._services
            .WarehouseRequest()
            .statusModify({id:item.id,status: status_id})
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                this.getList();
                this._toastr.success(res.message);
              } else {
                this._toastr.error(res.message);
              }
            });
        }
      });
  }

  creatWarehousePurchare(item){
    //todo mua hàng
    this._router.navigate([`/main/purchase/detail/0/${item.id}/0`]);
  }

  creatWarehouseExport(item){
    //todo xuất luân chuyển
    this._router.navigate([`/main/warehouses/warehouse-export/detail/3/0/${item.id}`]);
  }
}
