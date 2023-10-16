import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
// import { CategoryStatus } from 'src/app/shared/common/app.constants';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-modal-create-edit',
  templateUrl: './modal-create-edit.component.html',
  styleUrls: ['./modal-create-edit.component.css']
})
export class ModalCreateEditComponent implements OnInit {
  @Input() category: Array<any>;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  categoryStallsCreate: any;
  isCreate: boolean = true;
  formSubmitted = false;
  product_categories: any = [];

  constructor(
    private categoryService: POSServices,
    public modal: NgbActiveModal,
    private confirmDialog: ConfirmDialogService,
    private toast: ToastrService,
  ) { }

  initForm() {
    this.formGroupCreate = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      note: new FormControl(''),
      category_id: new FormControl(null,[Validators.required]),
      is_delete: new FormControl(false),
      is_active: new FormControl(true),
    });
  }

  get lf() {
    return this.formGroupCreate.controls;
  }

  ngOnInit(): void {
    this.initForm();
    this.getOptions();
  }

  getOptions() {
    let product = lastValueFrom(this.categoryService.Category().Product().getOpt())
    Promise.all([product]).then((res: any[]) => {
      this.product_categories = res[0].data.lists;
      if (this.itemDetail) {
        this.isCreate = false;
        this.formGroupCreate.patchValue({ ...this.itemDetail });
      }
    })
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.categoryStallsCreate = this.formGroupCreate.value;

    if (!this.itemDetail)//thêm mới
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn tạo mới bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.Category().Stalls().add(this.categoryStallsCreate).subscribe((rs: any) => {
              if (rs.statusCode == 200) {
                this.toast.success(rs.message);
              } else {
                this.toast.warning(rs.message);
              }
              this.itemSubmited.emit(rs.data);
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
            this.categoryStallsCreate.id = this.itemDetail.id;
            this.categoryService.Category().Stalls().edit(this.categoryStallsCreate).subscribe((rs: any) => {
              if (rs.statusCode == 200) {
                this.toast.success(rs.message);
              } else {
                this.toast.warning(rs.message);
              }
              this.itemSubmited.emit(rs.data);
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
