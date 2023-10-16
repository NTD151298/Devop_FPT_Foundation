import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { code_province } from 'src/services/common/conts';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { PartnerCreateComponent } from '../partner-create/partner-create.component';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent implements OnInit {
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
  items: any[] = [];
  province: any[] = code_province
  constructor(
    public _services: POSServices,
    public _toastr: ToastrService,
    private _router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.province = mapArrayForDropDown(this.province, 'name', 'code');
    this.getOptions();
  }
  getOptions() {
    let today = new Date();
    this.filter.start_date = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    this.filter.end_date = today;
    this.getList();
  }
  add() {
    const dialogRef = this.modalService.open(PartnerCreateComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getOptions();
      }
    });
  }
  edit(id: any) {
    this._router.navigate([`/main/partners/detail/${id}`]);
  }
  getList(reset?: any, event?: any) {
    if (reset) {
      this.resetPaging()
    }
    if (event) {
      this.paging.pageIndex = event.page + 1;
    }
    let data = {
      // start_date: new Date(this.filter.start_date).toISOString(),
      // end_date: new Date(this.filter.end_date).toISOString(),
      // status_id: 10,
      keyword: this.filter.keyword || '',
      // category_code: this.filter.category_code || '',
      province_code: this.filter.province_code || 0,
      page_size: this.paging.pageSize,
      page_number: this.paging.pageIndex
    }
    this._services.Partner().getList(data).subscribe(({ data }: any) => {
      this.items = data.lists;
      this.items.map(obj => {
        obj.province_name = (obj?.province_code) ? this.province.find(ele => ele.value == obj.province_code).label : "";
      });
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

}
