import { filter } from 'rxjs/operators';
import { POSServices } from 'src/services/pos/pos.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-packing',
  templateUrl: './category-packing.component.html',
  styleUrls: ['./category-packing.component.scss']
})
export class CategoryPackingComponent implements OnInit {
  formSearch: FormGroup;
  search: string = "";

  page?: number = 1;
  page_size = 10;
  totalRows: number;
  stt: number;
  constructor(
    private categoryService: POSServices,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private _toastr: ToastrService,
  ) { }
  categoryPacking: any;
  lang: string;
  initForm() {
    this.formSearch = new FormGroup({
      search: new FormControl('')
    });
  }
  get lf() {
    return this.formSearch.controls;
  }
  ngOnInit(): void {
    this.initForm();
    this.getList();
    //this.observableSearch();
  }

  getList(): void {
    let search = this.formSearch.controls['search'].value;
    this.categoryService.Category().Packing().getList({
      keyword: search,
      page_size: this.page_size,
      page_number: this.page
    }).subscribe(rs => {
      this.categoryPacking = rs['data'].lists;
      this.totalRows = rs['data'].totalcount;
      this.stt = this.page_size * (rs['data'].page - 1);
    })
  }

  observableSearch() {
    this.formSearch.get('search').valueChanges.pipe(
      debounceTime(500),
      switchMap(keyword => {
        return this.categoryService.Category().Product().getList({
          keyword: keyword,
          page_size: 10,
          page_number: this.page
        })
      })
    ).subscribe(res => {
      this.categoryPacking = res['data'].lists;
      this.totalRows = res['data'].totalcount;
      this.stt = this.page_size * ( res['data'].page - 1);
    })
  }

  onKeyUpEvent(event: any) {
    this.search = event.target.value;
    this.getList();
  }

  onChangedPage(event: any): void {
    this.page = event.page;
    this.getList();
  }

  openCreatePackingModal(item, index) {
    const dialogRef = this.modalService.open(ModalCreateEditComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.category = this.categoryPacking;
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  deleteCategoryPacking(id: number) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.categoryService.Category().Packing().delete(id).subscribe((res: any) => {
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
