import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.css']
})
export class VoucherListComponent implements OnInit {
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
  listStatus: any = [
    { label: 'Đang xét duyệt', value: 0 },
    { label: 'Đang áp dụng', value: 1 },
    { label: 'Đã từ chối', value: 2 },
  ]
  items: any[] = [];
  constructor(public _services: POSServices, public _toastr: ToastrService, private _router: Router, private confirmDialog: ConfirmDialogService) { }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    this.getList();
  }
  add() {
    this._router.navigate([`/main/voucher/detail/0`])
  }
  detail(item: any) {
    this._router.navigate([`/main/voucher/detail/${item.id}`])
  }
  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging()
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      status: this.filter.status,
      code: this.filter.keyword || '',
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex
    }
    this._services.Voucher().getList(data).subscribe(({ data }: any) => {
      this.items = data.lists
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
  changeStatus({ id }, status) {
    this.confirmDialog.confirm('', `Bạn có thực sự muốn thực hiện thao tác?`, 'Xác nhận', 'Huỷ', 'md')
      .then((confirmed) => {
        if (confirmed) {
          this._services.Voucher().get(id).subscribe((res: any) => {
            if (res.statusCode === 200) {
              res.data.status_id = status;
              this._services.Voucher().edit(res.data).subscribe((resedit: any) => {
                if (resedit.statusCode === 200) {
                  this._toastr.success('Cập nhật thành công!')
                  this.getList();
                } else {
                  this._toastr.error(resedit.message)
                }
              })
            } else {
              this._toastr.error('Có lỗi xảy ra trong quá trình xử lý!');
            }
          })
        }
      })

  }
  delete({ id }) {
    this._services.Voucher().delete(id).subscribe((res: any) => {
      if (res.statusCode) {
        this._toastr.success('Cập nhật thành công!');
        this.getList()
      } else {
        this._toastr.error(res.message)
      }
    })
  }
}
