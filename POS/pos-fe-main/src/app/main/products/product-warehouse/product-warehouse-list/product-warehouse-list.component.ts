import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { ProductViewModel } from 'src/app/models/pos/product';
import { PrintCodeComponent } from 'src/app/pos/barcode/print-code/print-code.component';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-product-warehouse-list',
  templateUrl: './product-warehouse-list.component.html',
  styleUrls: ['./product-warehouse-list.component.css'],
  providers: [DialogService]
})
export class ProductWarehouseListComponent implements OnInit {
  @ViewChild('paginator') paginator: any;
  filter: any = {
    keyword: '',
    category_code: '',
    status_price:0
  }
  paging: any = {
    pageSize: 15,
    pageIndex: 1,
    TotalItems: 0
  }
  listPartner: any = [];
  products: ProductViewModel[] = [];
  product_categories: any = [];
  listPrint: any = [];
  checkboxAll: boolean = false;
  exportData: any = [];
  list_status_price: any = [{value:0,label:'Tất cả'},{value:1,label:'Chưa có giá'},{value:2,label:'Đã có giá'}];
  constructor(public _services: POSServices,
    public _router: Router,
    public dialogService: DialogService,
    private auth: AuthenticationService,
    private toast: ToastrService,
    ) { }

  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    // let today = new Date();
    // this.filter.start_date = null;
    // this.filter.end_date = null;
    let product_cat = lastValueFrom(this._services.Category().Product().getOpt())
    let partners = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([product_cat, partners]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
      this.listPartner = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
      this.getList();
    })
  }
  add() {

  }

  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging()
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      keyword: this.filter.keyword || '',
      category_code: this.filter.category_code || '',
      warehouse_id: this.auth.currentUserWarehouseId,
      partner_id: this.filter.partner_id || 0,
      start_date: this.filter.start_date || null,
      end_date: this.filter.end_date || null,
      status_price: this.filter.status_price,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex
    }
    this._services.Product().product_detail_warehouse_list(data).subscribe(({ data }: any) => {
      this.products = data.lists;
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

  }
  cancel() {

  }

}
