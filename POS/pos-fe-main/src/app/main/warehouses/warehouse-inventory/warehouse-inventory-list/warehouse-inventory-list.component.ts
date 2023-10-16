import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { UltisService } from 'src/app/shared/services/ultis.service';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { WarehouseInventoryAddComponent } from '../warehouse-inventory-add/warehouse-inventory-add.component';

@Component({
  selector: 'app-warehouse-inventory-list',
  templateUrl: './warehouse-inventory-list.component.html',
  styleUrls: ['./warehouse-inventory-list.component.css'],
  providers: [DialogService],
})
export class WarehouseInventoryListComponent implements OnInit {
  @ViewChild('paginator') paginator: any;

  filter: any = {
    keyword: '',
    start_date: '',
    end_date: '',
    warehouse_id: '',
  };
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };
  listWarehouse: any = [];
  items: any[] = [];
  exportData: any = [];
  modelPrint: any;
  constructor(
    public _services: POSServices,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private auth: AuthenticationService,
    private shareService: ShareStateService,
    public dialogService: DialogService,
    private utils: UltisService
  ) {
    this.shareService.statePageName = 'app-warehouse-inventory-list';
  }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([warehouse]).then((res: any) => {
      this.listWarehouse = this.utils.genWarehouses(res[0].data);
      this.filter.warehouse_id = this.auth.currentUserWarehouseId;
      let stagePage = this.shareService.getStatePage();
      if (stagePage) {
        this.paging = stagePage.paging;
        setTimeout(() => {
          this.filter = stagePage.filter;
          this.paginator.changePage(this.paging.pageIndex - 1);
        }, 100);
      } else {
        this.getList();
      }
    });
  }
  add() {
    const ref = this.dialogService.open(WarehouseInventoryAddComponent, {
      data: 0,
      header: 'Thêm phiếu kiểm kho',
    });
    ref.onClose.subscribe((a: any) => {
      if (a) {
        this.shareService.updateStateInventory(a);
        this._router.navigate([`main/warehouses/warehouse-inventory/detail/0`]);
      }
    });
  }
  edit(item: any) {
    this.shareService.setStatePage({
      filter: this.filter,
      paging: this.paging,
    });
    this._router.navigate([`main/warehouses/warehouse-inventory/detail/${item.id}`]);
  }
  approve(item) {
    this.confirmDialog
      .confirm('', `Bạn có thực sự muốn duyệt phiếu kiểm kho ?`, 'Xác nhận', 'Huỷ', 'md')
      .then((confirmed) => {
        if (confirmed) {
          this._services
            .WarehouseInventory()
            .approve(item.id)
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
  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      start_date: this.filter.start_date || '',
      end_date: this.filter.end_date || '',
      warehouse_id:
        this.filter.warehouse_id || this.auth.currentUserWarehouseId,
      status_id: 10,
      keyword: this.filter.keyword || '',
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .WarehouseInventory()
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
  printInventory(id) {
    this._services
      .WarehouseInventory()
      .print(id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.modelPrint = res.data;
          this.modelPrint.total_quantity = res.data.products.reduce(
            (sum, current) => sum + current.quantity,
            0
          );
          this.modelPrint.total_price = res.data.products.reduce(
            (sum, current) => sum + current.import_price * current.quantity,
            0
          );
        } else {
          this._toastr.error(res.message);
        }
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
  delete(item?: any) {}
  cancel() {}
}
