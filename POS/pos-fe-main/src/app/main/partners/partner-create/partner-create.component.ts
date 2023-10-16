import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { code_province, symbol_supplier } from 'src/services/common/conts';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { LocationService } from 'src/services/pos/location.service';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-partner-create',
  templateUrl: './partner-create.component.html',
  styleUrls: ['./partner-create.component.css']
})
export class PartnerCreateComponent implements OnInit {

  id: any;
  item: any;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  formGroupCreate!: FormGroup;
  province: any[] = code_province

  constructor(
    private _services: POSServices,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.province = mapArrayForDropDown(this.province, 'name', 'code');
    this.initCreateForm();
    if (this.itemDetail) {
      this.setFormValue(this.itemDetail);
    }
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      is_delete: false,
      id_ecom: 0,
      code: "",
      name: ["", Validators.required],
      phone: "",
      website: "",
      email: "",
      taxcode: ["", Validators.required],
      introduce: "",
      province_code: [0, Validators.required],
    })
  }

  setFormValue(item) {
    this.formGroupCreate.patchValue(item)
  }

  save() {
    this.formGroupCreate.patchValue({
      code: `S1${this.formGroupCreate.value.province_code}${symbol_supplier}`
    });
    if (this.formGroupCreate.invalid) {
      this.toast.warning("Yêu cầu nhập đầy đủ trường bắt buộc & không được nhập trùng");
      return;
    }
    if (!this.itemDetail)//thêm mới
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn tạo mới bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this._services.Partner().add(this.formGroupCreate.value).subscribe((rs: any) => {
              this.toast.success(rs['message']);
              this.itemSubmited.emit(rs['data']);
              this.close()
            }, ({ error }) => {
              if (error['statusCode'] == 500) {
                this.toast.warning("Yêu cầu nhập đầy đủ trường bắt buộc & không được nhập trùng");
              }
              else {
                this.toast.warning(error['message']);
              }
            });
          }
        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this._services.Partner().edit(this.formGroupCreate.value).subscribe(rs => {
              this.toast.success("Cập nhật đối tác thành công !");
              this.itemSubmited.emit(rs['data']);             
              this.close()
            }, ({ error }) => {
              if (error['statusCode'] == 500) {
                this.toast.warning("Yêu cầu nhập đầy đủ trường bắt buộc & không được nhập trùng");
              }
              else {
                this.toast.warning(error['message']);
              }
            })
          }
        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

  close(): void {
    this.modal.close();
  }

}
