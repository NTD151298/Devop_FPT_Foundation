import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { statusPurchase } from 'src/app/shared/common/app.constants';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-purchare',
  templateUrl: './purchare.component.html',
  styleUrls: ['./purchare.component.css']
})
export class PurchareComponent implements OnInit {
  @ViewChild('paginator') paginator: any
  filter: any = {
    keyword: '',
    status_id: '',
    start_date: '',
    end_date: '',
  }
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0
  }
  listPartner: any = [];
  listStatus;
  items: any[] = [];
  constructor(
    public _services: POSServices,
    private _router: Router,
    private _toastr: ToastrService,
    private shareService: ShareStateService,
    private confirmDialog: ConfirmDialogService
  ) {
    this.listStatus = mapArrayForDropDown(statusPurchase, 'name', 'id');
    this.shareService.statePageName = 'app-purchare';
  }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let partner = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([partner]).then((res: any) => {
      this.listPartner = mapArrayForDropDown(res[0].data.lists, 'name', 'id')
      let stagePage = this.shareService.getStatePage();
      if (stagePage) {
        this.paging = stagePage.paging;
        this.filter = stagePage.filter;
        setTimeout(() => this.paginator.changePage(this.paging.pageIndex - 1), 100);
      } else {
        this.getList();
      }
    })
  }
  add() {
    this._router.navigate([`main/purchase/detail/0/0/0`])
  }
  edit(item: any,readonly) {
    this.shareService.setStatePage({
      filter: this.filter, paging: this.paging
    });
    this._router.navigate([`main/purchase/detail/${item.id}/0/${readonly}`])
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
      this.resetPaging()
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      start_date: (!!start_date) ? start_date.toISOString() : '',
      end_date: (!!end_date) ? end_date.toISOString() : '',
      keyword: this.filter.keyword || '',
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex
    }
    if (this.filter.status_id == null) {
      data['status_id'] = ''
    } else {
      data['status_id'] = this.filter.status_id
    }
    this._services.Purchase().getList(data).subscribe(({ data }: any) => {
      this.items = data.lists;
      this.items.forEach(obj => {
        obj.status_idName = this.listStatus.find(ele => ele.value == obj.status_id).label;
      })
      this.paging = {
        ...this.paging,
        pageIndex: data.page,
        TotalItems: data.totalcount
      }
    })
  }
  resetPaging() {
    this.paginator.changePage(0);
    this.paging =
    {
      ...this.paging,
      pageIndex: 1,
      TotalItems: 0
    }
  }
  refreshFilter() {
    this.filter.keyword = '';
    this.getList(true);
  }
  save() {

  }
  delete(item?: any) {
    this.confirmDialog.confirm('', `Bạn có thực sự muốn xóa bản ghi này ?`, 'Xác nhận', 'Huỷ', 'md')
      .then((confirmed) => {
        if (confirmed) {
          this._services.Purchase().delete(item.id).subscribe((res: any) => {
            if (res.statusCode === 200) {
              this._toastr.success(res.message);
              this.getList();
            } else {
              this._toastr.error(res.message)
            }
          })
        }
      })
  }
  cancel() {

  }


}
