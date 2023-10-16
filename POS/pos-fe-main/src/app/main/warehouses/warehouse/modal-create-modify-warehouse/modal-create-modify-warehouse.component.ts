import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';
import {
  TypeWarehouse,
} from 'src/app/shared/common/app.constants';
import { LocationService } from 'src/services/pos/location.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { code_province } from 'src/services/common/conts';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';

@Component({
  selector: 'app-modal-create-modify-warehouse',
  templateUrl: './modal-create-modify-warehouse.component.html',
  styleUrls: ['./modal-create-modify-warehouse.component.css'],
})
export class ModalCreateModifyWarehouseComponent implements OnInit {
  private _itemId: number = 0;
  @Input() set itemId(value: number) {
    this._itemId = value;
    this.initDataForm(this._itemId);
  }
  get itemId(): number {
    return this._itemId;
  }
  province: any[] = code_province
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;

  typeWarehouse = TypeWarehouse;
  parents: any[] = [];

  constructor(
    private _pOSServices: POSServices,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.province = mapArrayForDropDown(this.province, 'name', 'code');
    this.initCreateForm();
    this.getWarehouseList();
  }

  initDataForm(id: number) {
    if (id == 0) {
    } else {
      this._pOSServices
        .Warehouse()
        .get(id)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.setValue(res.data);
          } else {
            this.toast.error(res.message);
          }
        });
    }
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      userAdded: JSON.parse(localStorage.getItem('userInfo')).id,
      name: '',
      description: '',
      code: '',
      type: 1,
      address: '',
      is_active: true,
      parent_id: 0,
      warehouse_type: 'T',      
      province_code: 0
    });
  }

  setValue(user: any) {
    this.formGroupCreate.patchValue(user);
  }

  getWarehouseList() {
    this._pOSServices
      .Warehouse()
      .getList({
        type: 1,
        keyword: '',
        page_number: 0,
        page_size: 10,
      }).subscribe((rs: any) => {
        if (rs.statusCode === 200) {
          this.parents = rs.data.lists.filter((e) => e.parent_id == 0);
        } else {
          this.toast.error(rs.message);
        }
      });
  }

  close(): void {
    this.modal.close();
  }

  save() {
    if (this._itemId == 0) {
      this.formGroupCreate.patchValue({
        code: `S${this.formGroupCreate.value.province_code}`,    
      });
    }   
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.formGroupCreate.value.type = parseInt(this.formGroupCreate.value.type);
    this.formSubmitted = true;
    if (this._itemId == 0) {
      this.confirmDialog
        .confirm(
          'Please confirm..',
          'Bạn có thực sự muốn tạo mới bản ghi này ?'
        )
        .then((confirmed) => {
          if (confirmed) {
            this._pOSServices
              .Warehouse()
              .add(this.formGroupCreate.value)
              .subscribe((rs: any) => {
                if (rs.statusCode == 200) {
                  this.toast.success(rs.message);
                } else {
                  this.toast.warning(rs.message);
                }
                this.itemSubmited.emit(rs.data);
                this.close();
              });
          }
        })
        .catch(() =>
          console.log(
            'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
          )
        );
    } else {
      this.confirmDialog
        .confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this._pOSServices
              .Warehouse()
              .edit(this.formGroupCreate.value)
              .subscribe((rs: any) => {
                this.itemSubmited.emit(rs.data);
                if (rs.statusCode == 200) {
                  this.toast.success('Cập nhật kho thành công !');
                } else {
                  this.toast.warning(rs.message);
                }
                this.close();
              });
          }
        })
        .catch(() =>
          console.log(
            'User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'
          )
        );
    }
  }
}
