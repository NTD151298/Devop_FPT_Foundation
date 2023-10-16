import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateEditComponent } from './modal-create-edit/modal-create-edit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ModalCreateEditGroupUserComponent } from '../modal-create-edit-group-user/modal-create-edit-group-user.component';
import { UserService } from 'src/services/pos/user.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { ModalCreateEditUserWarehouseComponent } from './modal-create-edit-user-warehouse/modal-create-edit-user-warehouse.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  stt: number = 0;
  totalRows: number = 0;
  formGroupCreate: FormGroup;

  userList: any;
  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder,
    private cdr:ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // this.fullName = this.storeService.get('fullName');
    // this.username=this.storeService.get("username");
    this.initFormGroupCreate();
    this.getListUser();
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      full_name: '',
      username: '',
      page_number: 1,
      page_size: 20,
    })
  }

  search() {
    this.getListUser();
  }

  reset() {
    this.formGroupCreate = this.fb.group({
      full_name: '',
      username: '',
      page_number: 1,
      page_size: 20,
    })
    this.getListUser()
  }

  getListUser(): void {
    this.userService.getListUser(this.formGroupCreate.value).subscribe(rs => {
      this.totalRows = rs.data.totalcount;
      this.userList = rs.data.lists;
      this.stt = this.formGroupCreate.value.page_size * (rs.data.page - 1);
    })
  }

  onChangedPage(event: any): void {
    this.formGroupCreate.value.page_number = event.page;
    this.getListUser();
  }

  openCreateModifyUserModal(item?: any, index?: any) {
    const dialogRef = this.modalService.open(ModalCreateEditComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.user = this.userList;
    dialogRef.componentInstance.itemDetail = item || null;
    this.cdr.markForCheck();
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListUser();
      }
    });
  }

  openCreateModifyUserGroupModal(item?: any, index?: any) {
    const dialogRef = this.modalService.open(ModalCreateEditGroupUserComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.user = item || null;
    dialogRef.componentInstance.title = 'Chỉnh sửa nhóm của người dùng' || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListUser();
      }
    });
  }

  openCreateModifyUserWarehouse(item?: any, index?: any) {
    const dialogRef = this.modalService.open(ModalCreateEditUserWarehouseComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.user = item || null;
    dialogRef.componentInstance.title = 'Chỉnh sửa kho của người dùng' || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => {
      if (res) {
        this.getListUser();
      }
    });
  }

  forgotPassword(item?: any) {
    const dialogRef = this.modalService.open(ForgotPasswordComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.user = this.userList;
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res?: any) => { });
  }

}
