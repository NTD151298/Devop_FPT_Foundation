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
  selector: 'app-modal-create-edit-group-role',
  templateUrl: './modal-create-edit-group-role.component.html',
  styleUrls: ['./modal-create-edit-group-role.component.scss']
})
export class ModalCreateEditGroupRoleComponent implements OnInit {

  @Input() role;
  @Input() title;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  groupList;
  groupRoleList;
  selectedGroupId;
  statusGroupList = [];

  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;
  stt: number = 0;
  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    forkJoin([this.userService.adminGroupListUrl(), this.userService.adminRoleGroupListUrl(this.role.id)])
      .subscribe(([groupList, groupRoleList]) => {
        this.groupList = groupList.data;
        this.groupRoleList = groupRoleList.data;
        this.handleData(this.groupList, this.groupRoleList)
        this.initCreateGroupRoleForm()
        this.setValueGroupRoleForm()
      })
  }

  handleData(groupList, groupRoleList) {
    for (let j = 0; j < groupList.length; j++) {
      for (let i = 0; i < groupRoleList.length; i++) {
        if (groupList[j].id == groupRoleList[i].group_id) {
          this.statusGroupList.push(true)
          break;
        } else {
          if (i == groupRoleList.length - 1) {
            this.statusGroupList.push(false)
            break;
          }
          continue
        }
      }
    }
  }

  initCreateGroupRoleForm() {
    this.formGroupCreate = new FormGroup({
      role_id: new FormControl(this.role.id),
      group_id: this.addGroup(),
    })
  }

  setValueGroupRoleForm() {
    this.formGroupCreate.patchValue({
      role_id: this.role.id,
      group_id: this.statusGroupList,
    })
  }

  addGroup() {
    const arr = this.groupList.map(item => {
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  get groupArray() {
    return <FormArray>this.formGroupCreate.get('group_id');
  }

  getSelectedGroup() {
    this.selectedGroupId = [];
    this.groupArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedGroupId.push(this.groupList[i].id);
      }
    });
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }

    let adminGroupRoleList = [];
    if (this.groupRoleList.length > 0) {
      this.groupRoleList.forEach(obj => {
        if (this.selectedGroupId.includes(obj.group_id)) {
          adminGroupRoleList.push({
            id: obj.id,
            is_delete: obj.is_delete,
            role_id: obj.role_id,
            group_id: obj.group_id,
          });
          this.selectedGroupId.splice(this.selectedGroupId.indexOf(obj.group_id), 1)
        } else {
          adminGroupRoleList.push({
            is_delete: true,
            id: obj.id,
            role_id: obj.role_id,
            group_id: obj.group_id
          })
        }
      })
      this.selectedGroupId.forEach(obj => {
        adminGroupRoleList.push({
          id: 0,
          is_delete: false,
          role_id: this.role.id,
          group_id: obj,
        })
      })
      this.userService.adminRoleGroupModifyListUrl(adminGroupRoleList).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Cập nhật nhóm phân quyền thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.selectedGroupId.forEach(obj => {
        adminGroupRoleList.push({
          id: 0,
          is_delete: false,
          role_id: this.role.id,
          group_id: obj,
        })
      })
      this.userService.adminRoleGroupCreateListUrl(adminGroupRoleList).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Tạo nhóm phân quyền thành công !");
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
