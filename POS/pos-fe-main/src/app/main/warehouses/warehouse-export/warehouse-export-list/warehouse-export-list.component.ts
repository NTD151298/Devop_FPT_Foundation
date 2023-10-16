import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { compareDate } from 'src/app/shared/globlafunction';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-warehouse-export-list',
  templateUrl: './warehouse-export-list.component.html',
  styleUrls: ['./warehouse-export-list.component.css'],
})
export class WarehouseExportListComponent implements OnInit {
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
  listWarehouse: any = [];
  warehouse_clone: any = [];
  listPartner: any = [];
  listStatus: any = [
    { label: 'Đồng ý', value: 1 },
    { label: 'Chưa xử lý', value: 0 },
  ];
  items: any[] = [];
  modelPrint:any;

  constructor(
    public _services: POSServices,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private shareService: ShareStateService,
    private _auth: AuthenticationService,
    private utils: UltisService
  ) {this.shareService.statePageName = 'app-warehouse-export-list';}

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    let partner = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([warehouse, partner]).then((res: any) => {
      this.listWarehouse = this.utils.genWarehouses(res[0].data);
      this.warehouse_clone = res[0].data;
      this.filter.start_date = new Date();
      this.filter.end_date = new Date();
      this.filter.warehouse_id = this._auth.currentUserWarehouseId;
      this.listPartner = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
      let stagePage = this.shareService.getStatePage();
      if (stagePage) {
        this.paging = stagePage.paging;
        this.filter = stagePage.filter;
        setTimeout(() => this.paginator.changePage(this.paging.pageIndex -1),100);
      }else{
        this.getList();
      }
    });
  }

  add(type) {
    this._router.navigate([`main/warehouses/warehouse-export/detail/${type}/0`]);
  }
  edit(item: any) {
    this.shareService.setStatePage({
      filter: this.filter, paging: this.paging
    });
    this._router.navigate([`main/warehouses/warehouse-export/detail/${item.type}/${item.id}`]);
  }
  approve(item) {
    this.confirmDialog
      .confirm('', `Bạn có thực sự muốn duyệt phiếu ?`, 'Xác nhận', 'Huỷ', 'md')
      .then((confirmed) => {
        if (confirmed) {
          this._services
            .WarehouseExport()
            .approve(item.id)
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                this._toastr.success(res.message);
                this.getList();
              } else {
                this._toastr.error(res.message);
              }
            });
        }
      });
  }
  confirm(item) {
    this.confirmDialog
      .confirm('', `Bạn có thực sự muốn xuất kho phiếu này ${item.code} ?`, 'Xác nhận', 'Huỷ', 'md')
      .then((confirmed) => {
        if (confirmed) {
          this._services
            .WarehouseExport()
            .confirm(item.id)
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                this._toastr.success(res.message);
                this.getList();
              } else {
                this._toastr.error(res.message);
              }
            });
        }
      });
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

    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      partner_id: this.filter.partner_id || 0,
      warehouse_id: this.filter.warehouse_id || this._auth.currentUserWarehouseId,
      status_id: this.filter.status_id || 10,
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
      start_date: start_date.toISOString()||null,
      end_date: end_date.toISOString()||null,
    };
    this._services
      .WarehouseExport()
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
  printExport(id){
    this._services.WarehouseExport().print(id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        let wh = this.warehouse_clone.find(
          (e) => e.id == res.data.warehouse_id
        );
        this.modelPrint = { ...res.data, address: wh.address,
          total_quantity: res.data.products.reduce((sum, current) => sum + current.quantity, 0),
          total_price : res.data.products.reduce((sum, current) => sum + (current.price * current.quantity), 0)
        };
        console.log(this.modelPrint);
      } else {
        this._toastr.error(res.message)
      }
    })
  }

  compareDate(start_date, end_date) {
    if (!compareDate(start_date, end_date)) {
      this._toastr.warning("Thời gian bắt đầu không được lớn hơn thời gian kết thúc");
    }
  }

  save() {}
  delete(item?: any) {}
  cancel() {}
}
