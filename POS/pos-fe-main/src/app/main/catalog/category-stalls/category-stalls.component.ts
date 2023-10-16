import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { POSServices } from 'src/services/pos/pos.service';
import { debounceTime, lastValueFrom, Subject, switchMap } from 'rxjs';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { UltisService } from 'src/app/shared/services/ultis.service';

@Component({
  selector: 'app-category-stalls',
  templateUrl: './category-stalls.component.html',
  styleUrls: ['./category-stalls.component.css']
})
export class CategoryStallsComponent implements OnInit {
  formSearch: any = {
    keyword: "",
    category_id: 0,
  };
  constructor(
    private categoryService: POSServices,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private _toastr: ToastrService,
    private utils: UltisService,
    private _auth: AuthenticationService,
    public fb: FormBuilder,
  ) { }
  listPartner: any = [];
  product_categories: any = [];
  categoryStalls: any;
  page?: number = 1;
  page_size = 10;
  totalRows: number;
  lang: string;
  stt: number;
  categoryChild: any;
  ngOnInit(): void {
    this.getOptions();
  }
  getOptions() {
    let product = lastValueFrom(this.categoryService.Category().Product().getOpt())
    Promise.all([product]).then((res: any[]) => {
      this.product_categories = mapArrayForDropDown(res[0].data.lists, 'name', 'id');
      this.formSearch.category_id = this.product_categories[0].value;
      this.getList();
    })
  }

  getList(): void {
    this.categoryService.Category().Stalls().getList(this.formSearch).subscribe(rs => {
      this.categoryStalls = rs['data'];
      // this.totalRows = rs['data'].totalcount;
      // this.stt = this.page_size * (rs['data'].page - 1);
    })
  }
  onChangedPage(event: PageChangedEvent): void {
    this.page = event.page;
    this.getList();
  }

  openCreateStallsModal(item, index) {
    const dialogRef = this.modalService.open(ModalCreateEditComponent,
      {
        size: 'lg',
      });
    // dialogRef.componentInstance.category = this.categoryProduct;
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  deleteCategoryStalls(item) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          item.is_delete = true
          this.categoryService.Category().Stalls().edit(item).subscribe((res: any) => {
            if (res.statusCode === 200) {
              this._toastr.success(res.message);
              this.getList();
            } else {
              this._toastr.error(res.message)
            }
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
