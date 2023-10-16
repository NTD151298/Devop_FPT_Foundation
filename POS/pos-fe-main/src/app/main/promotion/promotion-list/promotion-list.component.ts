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
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css']
})
export class PromotionListComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  filter = {
    type: 0,
    keyword: '',
    start_date: null,
    end_date: null
  }

  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };

  listPromotion = [];
  listType = [{
    id: 1,
    name: "Khuyến mại theo hàng hóa",
  }, {
    id: 2,
    name: "Khuyến mại theo hóa đơn"
  }, {
    id: 3,
    name: "Khuyến mại hàng tặng hàng"
  }]
  constructor(
    public _services: POSServices,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private shareService: ShareStateService,
    private _auth: AuthenticationService,
    private utils: UltisService
  ) { }

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
      end_date: this.filter.end_date,
      start_date: this.filter.start_date,
      type: this.filter.type || 10,
      keyword: this.filter.keyword || '',
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Promotion()
      .getList(data)
      .subscribe(({ data }: any) => {
        console.log(data)
        this.listPromotion = data.lists;
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

  createPromotion(type) {
    this._router.navigate([`main/promotion/${type}`]);
  }

}
