import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { LocationService } from 'src/services/pos/location.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  @Input() user: Array<any>;
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  confirmPassword = {
    error: null,
    value: null
  };
  formSubmitted = false;
  constructor( 
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    this.initCreateForm();
  }

  initCreateForm() {
    this.formGroupCreate = new FormGroup({
      id: new FormControl(this.itemDetail.id),
      passwordOld: new FormControl('', [Validators.required]),
      passwordNew: new FormControl('', [Validators.required]),
    })
  }

  get lf() {
    return this.formGroupCreate.controls;
  }

  close(): void {
    this.modal.close();
  }

  save() {
    this.formSubmitted = true;
    this.confirmPassword.error = null;
    if (this.confirmPassword.value != this.formGroupCreate.value.passwordNew) {
      this.confirmPassword.error = true;
      return;
    }
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
      .then((confirmed) => {
        if (confirmed) {
          this.userService.changePasswordUser(this.formGroupCreate.value).subscribe(rs => {
            this.itemSubmited.emit(rs.data);

            if (rs.statusCode == 200) {
              this.toast.success("Cập nhật password user thành công !");
            } else {
              this.toast.success(rs.message);
            }
            this.close()
          })
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
