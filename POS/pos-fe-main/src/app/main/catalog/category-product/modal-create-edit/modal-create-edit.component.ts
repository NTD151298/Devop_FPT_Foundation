import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { CategoryStatus, PagingConstant } from 'src/app/shared/common/app.constants';
import { POSServices } from 'src/services/pos/pos.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-modal-create-edit',
  templateUrl: './modal-create-edit.component.html',
  styleUrls: ['./modal-create-edit.component.scss']
})
export class ModalCreateEditComponent implements OnInit {
  category: Array<any>;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  formGroupCreate: FormGroup;
  categoryCreate: any;
  isCreate: boolean = true;
  formSubmitted = false;
  id_edit: number = 0;
  parentId: number = 0;
  page_size = PagingConstant.page_size;
  listStatus: any = [
    {
      id: 0,
      name: "Chưa duyệt"
    }, {
      id: 1,
      name: "Đã duyệt"
    }
  ];
  loading = true;
  inputChange$ = new Subject();
  categoryStatus: typeof CategoryStatus = CategoryStatus;

  constructor(
    private categoryService: POSServices,
    public modal: NgbActiveModal,
    private confirmDialog: ConfirmDialogService,
    private toast: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    // this.inputChange$.pipe(
    //   debounceTime(500),
    //   switchMap(keyword => {
    //     console.log(keyword)
    //     return this.categoryService.Category().Product().getList({
    //       keyword: keyword,
    //       page_size: 20,
    //       page_number: 1
    //     })
    //   })
    // ).subscribe(res => {
    //   this.category = mapArrayForDropDown(res['data'].lists, 'name', 'id');
    // })
  }

  searchParent(keyword) {
    this.inputChange$.next(keyword)
  }

  initForm() {
    this.formGroupCreate = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      code: new FormControl(''),
      note: new FormControl(''),
      parent_id: new FormControl(0),
      order: new FormControl(0),
      status_id: new FormControl(0),
      ecom_id: new FormControl(0),
    });
  }

  get lf() {
    return this.formGroupCreate.controls;
  }

  ngOnInit(): void {
    this.categoryService.Category().Product().getList({
      keyword: '',
      page_size: 20,
      page_number: 0,
    }).subscribe(rs => {
      this.category = rs['data'].lists;
      this.category = mapArrayForDropDown(this.category, 'name', 'id');
      this.loading = false;
      this.initForm();
      if (this.itemDetail) {
        this.isCreate = false;
        this.formGroupCreate.patchValue({ ...this.itemDetail });
      }
      this.ref.detectChanges();
    })
  }

  // ngAfterContentChecked() {
  //   this.ref.detectChanges();
  // }


  async save(): Promise<void> {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }

    this.categoryCreate = this.formGroupCreate.value;
    //this.categoryCreate.is_deleted=false;
    if (!this.itemDetail)//thêm mới
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn tạo mới bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.Category().Product().add(this.categoryCreate).subscribe(rs => {
              if (rs['statusCode'] == 200) {
                this.toast.success(rs['message']);
              } else {
                this.toast.warning(rs['message']);
              }
              this.itemSubmited.emit(rs['data']);
              this.close()
            });
          }
        }
        )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
    else//sửa
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn chỉnh sửa bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryCreate.id = this.itemDetail.id;
            this.categoryService.Category().Product().edit(this.categoryCreate).subscribe(rs => {
              if (rs['statusCode'] == 200) {
                this.toast.success(rs['message']);
              } else {
                this.toast.warning(rs['message']);
              }
              this.itemSubmited.emit(rs['data']);
              this.close()
            });
          }
        }
        )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }


  close(): void {
    this.modal.close();
  }
}
