import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { LocationService } from 'src/services/pos/location.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { PagingConstant } from 'src/app/shared/common/app.constants';

@Component({
  selector: 'app-modal-create-edit-group-user',
  templateUrl: './modal-create-edit-group-user.component.html',
  styleUrls: ['./modal-create-edit-group-user.component.scss']
})
export class ModalCreateEditGroupUserComponent implements OnInit {

  @Input() user;
  @Input() group;
  @Input() title;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  itemList;
  userGroupList;
  selectedItemId;
  statusItemList = [];
  userList;

  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;
  stt: number;
  page?: number = 0;
  totalRows: number;
  page_size = PagingConstant.page_size;

  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    if (this.user) {
      forkJoin([this.userService.adminGroupListUrl(), this.userService.adminGroupUserListUrl(this.user.id)])
        .subscribe(([groupList, userGroupList]) => {
          this.itemList = groupList.data;
          this.userGroupList = userGroupList.data;
          this.handleData(this.itemList, this.userGroupList, 'group_id')
          this.initCreateUserGroupForm()
          this.setvalueUserGroupForm()
        })
    } else {
      forkJoin([this.userService.getListUser({
        page_number: this.page,
        page_size: this.page_size,
        username: '',
        full_name: ''
      }), this.userService.adminGroupUserListByGroupIdUrl(this.group.id)])
        .subscribe(([userList, userGroupList]) => {
          this.itemList = userList.data.lists;
          this.stt = this.page_size * userList.data.page;
          this.totalRows = userList.data.totalcount;
          this.userGroupList = userGroupList.data;
          this.handleData(this.itemList, this.userGroupList, 'user_id')
          this.initCreateGroupUserForm()
          this.setvalueGroupUserForm()
        })
    }
  }

  handleData(itemList, userGroupList, item_id) {
    for (let j = 0; j < itemList.length; j++) {
      for (let i = 0; i < userGroupList.length; i++) {
        if (itemList[j].id == userGroupList[i][item_id]) {
          this.statusItemList.push(true)
          break;
        } else {
          if (i == userGroupList.length - 1) {
            this.statusItemList.push(false)
            break;
          }
          continue
        }
      }
    }
  }

  initCreateUserGroupForm() {
    this.formGroupCreate = new FormGroup({
      user_id: new FormControl(this.user.id),
      group_id: this.addItem(),
    })
  }

  initCreateGroupUserForm() {
    this.formGroupCreate = new FormGroup({
      user_id: this.addItem(),
      group_id: new FormControl(this.group.id)
    })
  }

  setvalueUserGroupForm() {
    this.formGroupCreate.patchValue({
      user_id: (this.user.id),
      group_id: this.statusItemList,
    })
  }

  setvalueGroupUserForm() {
    this.formGroupCreate.patchValue({
      user_id: this.statusItemList,
      group_id: this.group.id
    })
  }

  get userArray() {
    return <FormArray>this.formGroupCreate.get('user_id');
  }

  get groupArray() {
    return <FormArray>this.formGroupCreate.get('group_id');
    // return this.formGroupCreate.get("group_id") as FormArray
  }

  addItem() {
    const arr = this.itemList.map(item => {
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  getSelectedGroup() {
    this.selectedItemId = [];
    this.groupArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedItemId.push(this.itemList[i].id);
      }
    });
  }

  getSelectedUser() {
    this.selectedItemId = [];
    this.userArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedItemId.push(this.itemList[i].id);
      }
    });
  }

  save() {
    let value;
    if (!!this.user) {
      value = 'group_id'
    } else {
      value = 'user_id'
    }
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    let adminGroupUserList = [];
    if (this.userGroupList.length > 0) {
      this.userGroupList.forEach(obj => {
        if (this.selectedItemId.includes(obj[value])) {
          adminGroupUserList.push({
            id: obj.id,
            is_delete: obj.is_delete,
            user_id: obj.user_id,
            group_id: obj.group_id,
          });
          this.selectedItemId.splice(this.selectedItemId.indexOf(obj[value]), 1)
        } else {
          adminGroupUserList.push({
            is_delete: true,
            id: obj.id,
            user_id: obj.user_id,
            group_id: obj.group_id
          })
        }
      })
      this.selectedItemId.forEach(obj => {
        adminGroupUserList.push({
          id: 0,
          is_delete: false,
          user_id: this.user ? this.user.id : obj,
          group_id: this.group ? this.group.id : obj,
        })
      })
      this.userService.adminGroupUserModifyListUrl(adminGroupUserList).subscribe(rs => {

        if (rs.statusCode == 200) {
          this.toast.success("Cập nhật nhóm người dùng thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.selectedItemId.forEach(obj => {
        adminGroupUserList.push({
          id: 0,
          is_delete: false,
          user_id: this.user ? this.user.id : obj,
          group_id: this.group ? this.group.id : obj,
        })
      })
      this.userService.adminGroupUserCreateListUrl(adminGroupUserList).subscribe(rs => {


        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới nhóm người dùng thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    }
  }

  close() {
    this.modal.close();
  }

}
