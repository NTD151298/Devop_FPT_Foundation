import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';

@Component({
  selector: 'app-modal-create-edit-role',
  templateUrl: './modal-create-edit-role.component.html',
  styleUrls: ['./modal-create-edit-role.component.css']
})
export class ModalCreateEditRoleComponent implements OnInit {

  @Input() role: Array<any>;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;

  listStatus = [{
    status: true,
    name: 'Tạm ngừng',
  }, {
    status: false,
    name: 'Kích hoạt',
  }]

  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    if (!!this.itemDetail) {
      this.initCreateForm();
      this.setValue(this.itemDetail)
    } else {
      this.initCreateForm();
      this.addRoleDetail();
    }
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      is_delete: false,
      name: '',
      code: '',
      note: '',
      role_Details: this.fb.array([])
    })
  }

  setValue(role: any) {
    this.formGroupCreate.patchValue(role);
    this.setArrayRoleDetailValue(role.role_Details)
  }

  setArrayRoleDetailValue(role_Detail) {
    const controls = this.formGroupCreate.get('role_Details') as FormArray;
    role_Detail.forEach(item => {
      controls.push(
        this.fb.group(item)
      )
    });
  }

  get role_Details_Array(): FormArray {
    return this.formGroupCreate.get('role_Details') as FormArray;
  }

  addRoleDetail() {
    this.role_Details_Array.push(this.fb.group({
      id: 0,
      is_delete: false,
      role_id: this.formGroupCreate.value.id || 0,
      code: "",
      name: ""
    }));
  }

  removeRoleDetails(id, index: number) {
    const formArray = this.role_Details_Array;

    if (id == 0) {
      formArray.removeAt(index);
    }else{
      this.role_Details_Array?.controls.forEach((ctrl:any, indexForm) => {
        if(index == indexForm){
          ctrl.value.is_delete = true;
        }
      })
    }
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    if (!this.itemDetail) {
      this.userService.adminRoleCreateUrl(this.formGroupCreate.value).subscribe(rs => {
        this.itemSubmited.emit(rs.data);

        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới quyền thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this.userService.adminRoleModifyUrl(this.formGroupCreate.value).subscribe(rs => {
              this.itemSubmited.emit(rs.data);

              if (rs.statusCode == 200) {
                this.toast.success("Cập nhật quyền thành công !");
              } else {
                this.toast.warning(rs.message);
              }
              this.close()
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
