import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Paginator } from 'primeng/paginator';
import { lastValueFrom } from 'rxjs';
import { ProductViewModel } from 'src/app/models/pos/product';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
// import { ProductEditComponent } from '../product-edit/product-edit.component';
// import { ProductsCreateComponent } from '../products-create/products-create.component';

@Component({
  selector: 'app-product-combo-list',
  templateUrl: './product-combo-list.component.html',
  styleUrls: ['./product-combo-list.component.css']
})
export class ProductComboListComponent implements OnInit {

  @ViewChild('paginator') paginator: Paginator;
  filter: any = {
    keyword: '',
    category_code: '',
  };
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0,
  };
  products: ProductViewModel[] = [];
  product_categories: any = [];
  constructor(
    public _services: POSServices,
    public _router: Router,
    private _toastr: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private modalService: NgbModal,
    private shareService: ShareStateService,
  ) { this.shareService.statePageName = 'app-product-list'; } 

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {

    let product_cat = lastValueFrom(
      this._services.Category().Product().getOpt()
    );
    Promise.all([product_cat]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(
        res[0].data.lists,
        'name',
        'code'
      );
      let stagePage = this.shareService.getStatePage();
      if (stagePage) {
        this.paging = stagePage.paging;
        this.filter = stagePage.filter;
        setTimeout(() => this.paginator.changePage(this.paging.pageIndex - 1), 100);
      } else {
        this.getList();
      }
    });
  }
  create(){
    this._router.navigate([`/main/products/product-combo/product-combo-detail/0`]);
  }

  edit(id: any) {
    this._router.navigate([`/main/products/product-combo/product-combo-detail/${id}`]);
  }
  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();      
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',     
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex,
    };
    this._services
      .Product()
      .getListCombo(data)
      .subscribe(({ data }: any) => {
        this.products = data.lists;
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
  save() { }
  delete(item?: any) {
    this.confirmDialog
      .confirm(
        '',
        `Bạn có thực sự muốn xóa bản ghi này ?`,
        'Xác nhận',
        'Huỷ',
        'md'
      )
      .then((confirmed) => {
        if (confirmed) {
          this._services
            .Product()
            .delete(item.id)
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
  cancel() { }

}
