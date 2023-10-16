import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
// import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { POSServices } from 'src/services/pos/pos.service';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-units',
  templateUrl: './category-units.component.html',
  styleUrls: ['./category-units.component.scss']
})
export class CategoryUnitsComponent implements OnInit {
  formSearch: FormGroup;
  constructor(
    private categoryService: POSServices,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private _toastr: ToastrService,
  ) { }
  categoryUnits: any;
  page?: number = 1;
  page_size = 10;
  totalRows: number;
  stt: number;

  ngOnInit(): void {
    this.initForm();
    this.getList();
    //this.observableSearch()
  }

  observableSearch() {
    this.formSearch.get('search').valueChanges.pipe(
      debounceTime(500),
      switchMap(keyword => {
        return this.categoryService.Category().Product().getList({
          keyword: keyword,
          page_size: 20,
          page_number: 1
        })
      })
    ).subscribe(res => {
      this.categoryUnits = res['data'].lists;
      this.totalRows = res['data'].totalcount;
      this.stt = this.page_size * (res['data'].page - 1);
    })
  }

  initForm() {
    this.formSearch = new FormGroup({
      search: new FormControl('')
    });
  }

  get lf() {
    return this.formSearch.controls;
  }

  getList(): void {
    let search = this.formSearch.controls['search'].value;
    this.categoryService.Category().Unit().getList({
      keyword: search,
      page_size: this.page_size,
      page_number: this.page,
    }).subscribe(rs => {
      this.categoryUnits = rs['data'].lists;
      this.totalRows = rs['data'].totalcount;
      this.stt = this.page_size * (rs['data'].page - 1);
    })
  }

  onKeyUpEvent(event: any) {
    this.formSearch.value.search = event.target.value;
    this.getList();
  }

  onChangedPage(event: PageChangedEvent): void {
    this.page = event.page;
    this.getList();
  }

  openCreateUnitsModal(item, index) {
    const dialogRef = this.modalService.open(ModalCreateEditComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.category = this.categoryUnits;
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  deleteCategoryUnits(id: number) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.categoryService.Category().Unit().delete(id).subscribe((res: any) => {
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
