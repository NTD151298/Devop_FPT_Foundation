import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { CategoryStatus } from 'src/app/shared/common/app.constants';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-modal-create-edit',
  templateUrl: './modal-create-edit.component.html',
  styleUrls: ['./modal-create-edit.component.scss']
})
export class ModalCreateEditComponent implements OnInit {

  @Input() category: Array<any>;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  categoryPackingCreate: any;
  isCreate: boolean = true;
  formSubmitted = false;
  categoryStatus: typeof CategoryStatus = CategoryStatus;
  listStatus: any = [
    {
      id: 0,
      name: "Chưa duyệt"
    }, {
      id: 1,
      name: "Đã duyệt"
    }
  ];

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
      code: new FormControl(''),
      note: new FormControl(''),
      order: new FormControl(0),
      status_id: new FormControl(0),
      ecom_id: new FormControl(0),
      is_delete: new FormControl(false),
    });
  }

  get lf() {
    return this.formGroupCreate.controls;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.itemDetail) {
      this.isCreate = false;
      this.formGroupCreate.patchValue({ ...this.itemDetail });
    }
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.categoryPackingCreate = this.formGroupCreate.value;

    if (!this.itemDetail)//thêm mới
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn tạo mới bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this.categoryService.Category().Packing().add(this.categoryPackingCreate).subscribe((rs: any) => {
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
            this.categoryPackingCreate.id = this.itemDetail.id;
            this.categoryService.Category().Packing().edit(this.categoryPackingCreate).subscribe((rs: any) => {
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
