import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { LocationService } from 'src/services/pos/location.service';

@Component({
  selector: 'app-modal-create-edit-group',
  templateUrl: './modal-create-edit-group.component.html',
  styleUrls: ['./modal-create-edit-group.component.css']
})
export class ModalCreateEditGroupComponent implements OnInit {

  @Input() group: Array<any>;
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
    private _locationService: LocationService,
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
    }
  }

  initCreateForm() {
    this.formGroupCreate = new FormGroup({
      id: new FormControl(0),
      is_delete: new FormControl(false),
      name: new FormControl(''),
      code: new FormControl(''),
      note: new FormControl(''),
    })
  }

  setValue(group: any) {
    this.formGroupCreate.patchValue(group);
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    } 
    if (!this.itemDetail) {
      this.userService.adminGroupCreateUrl(this.formGroupCreate.value).subscribe(rs => {
        this.itemSubmited.emit(rs.data);
        if(rs.statusCode == 200){
          this.toast.success("Thêm mới nhóm thành công !");
        }else{
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
      .then((confirmed) => {
        if(confirmed){
          this.userService.adminGroupModifyUrl(this.formGroupCreate.value).subscribe(rs => {
            this.itemSubmited.emit(rs.data);
            if(rs.statusCode == 200){
              this.toast.success("Cập nhật nhóm thành công !");
            }else{
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
