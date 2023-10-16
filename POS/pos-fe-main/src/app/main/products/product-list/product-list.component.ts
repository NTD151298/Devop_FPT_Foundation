import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Paginator } from 'primeng/paginator';
import { lastValueFrom } from 'rxjs';
import { ProductViewModel } from 'src/app/models/pos/product';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ShareStateService } from 'src/app/shared/services/share-state.service';
import { form_type } from 'src/services/common/enum';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { ProductsCreateComponent } from '../products-create/products-create.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
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
  product_stalls: any = [];
  product_group: any = [];

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
    let product_cat = lastValueFrom(this._services.Category().Product().getOpt());
    Promise.all([product_cat]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
      this.product_categories.map(obj => {
        obj.value = obj.code;
        obj.label = obj.name;
      });
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

  selectStall() {
    this.filter.category_stalls_code = 0;
    this.filter.category_group_code = 0;
    let data = { category_id: this.product_categories.find(obj => obj.value == this.filter.category_code).id }
    this._services.Category().Stalls().getOpt(data).subscribe((res: any) => {
      this.product_stalls = res.data;
      this.product_stalls.map(obj => {
        obj.value = obj.code;
        obj.label = obj.name;
      });
      this.getList();
    });
  }

  selectGroup() {
    this.filter.category_group_code = 0;
    let data = {
      category_id: this.product_categories.find(obj => obj.value == this.filter.category_code).id,
      stalls_id: this.product_stalls.find(obj => obj.value == this.filter.category_stalls_code).id
    }
    this._services.Category().Group().getOpt(data).subscribe((res: any) => {
      this.product_group = res.data;
      this.product_group.map(obj => {
        obj.value = obj.code;
        obj.label = obj.name;
      });
      this.getList();
    });
  }

  view(id) {
    this.shareService.setStatePage({
      filter: this.filter, paging: this.paging
    });
    this._router.navigate([`/main/products/product/edit/${id}/${form_type.readonly}`]);
  }
  create(id: any) {
    const dialogRef = this.modalService.open(ProductsCreateComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.id = id || 0;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      this.getList();
    });
  }
  edit(id: any) {
    this._router.navigate([`/main/products/product/edit/${id}/${form_type.edit}`]);
  }
  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging();
    }
    if (event) {
      this.paging.pageIndex = event?.page + 1 || 1;
    }
    let data: any = {
      keyword: this.filter.keyword || '',
      category_code: this.filter.keyword || "",
      page_size: this.paging.pageSize,
      page_number: event?.page + 1 || 1,
    };
    
    this._services
      .Product()
      .getList(data)
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
