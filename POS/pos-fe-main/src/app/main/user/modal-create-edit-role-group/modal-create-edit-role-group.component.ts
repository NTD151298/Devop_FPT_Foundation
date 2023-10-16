import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { LocationService } from 'src/services/pos/location.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';

@Component({
  selector: 'app-modal-create-edit-role-group',
  templateUrl: './modal-create-edit-role-group.component.html',
  styleUrls: ['./modal-create-edit-role-group.component.scss']
})
export class ModalCreateEditRoleGroupComponent implements OnInit {

  @Input() group;
  @Input() title;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  roleList;
  groupRoleList;
  selectedRoleId;
  statusRoleList = [];

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
    forkJoin([this.userService.adminRoleListUrl(), this.userService.adminRoleGroupListByGroupIdUrl(this.group.id)])
      .subscribe(([roleList, groupRoleList]) => {
        this.roleList = roleList.data;
        this.groupRoleList = groupRoleList.data;
        this.handleData(this.roleList, this.groupRoleList)
        this.initCreateGroupRoleForm()
        this.setValueGroupRoleForm()
      })
  }

  handleData(groupList, groupRoleList) {
    for (let j = 0; j < groupList.length; j++) {
      for (let i = 0; i < groupRoleList.length; i++) {
        if (groupList[j].id == groupRoleList[i].role_id) {
          this.statusRoleList.push(true)
          break;
        } else {
          if (i == groupRoleList.length - 1) {
            this.statusRoleList.push(false)
            break;
          }
          continue
        }
      }
    }
  }

  initCreateGroupRoleForm() {
    this.formGroupCreate = new FormGroup({
      role_id: this.addRole(),
      group_id: new FormControl(''),
    })
  }

  setValueGroupRoleForm() {
    this.formGroupCreate.patchValue({
      role_id: this.statusRoleList,
      group_id: this.group.id,
    })
  }

  addRole() {
    const arr = this.roleList.map(item => {
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  get roleArray() {
    return <FormArray>this.formGroupCreate.get('role_id');
  }

  getSelectedRole() {
    this.selectedRoleId = [];
    this.roleArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedRoleId.push(this.roleList[i].id);
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
        if (this.selectedRoleId.includes(obj.role_id)) {
          adminGroupRoleList.push({
            id: obj.id,
            is_delete: obj.is_delete,
            role_id: obj.role_id,
            group_id: obj.group_id,
          });
          this.selectedRoleId.splice(this.selectedRoleId.indexOf(obj.role_id), 1)
        } else {
          adminGroupRoleList.push({
            is_delete: true,
            id: obj.id,
            role_id: obj.role_id,
            group_id: obj.group_id
          })
        }
      })
      this.selectedRoleId.forEach(obj => {
        adminGroupRoleList.push({
          id: 0,
          is_delete: false,
          role_id: obj,
          group_id: this.group.id,
        })
      })
      this.userService.adminRoleGroupModifyListUrl(adminGroupRoleList).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Cập nhật phân quyền nhóm thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.selectedRoleId.forEach(obj => {
        adminGroupRoleList.push({
          id: 0,
          is_delete: false,
          role_id: obj,
          group_id: this.group.id,
        })
      })
      this.userService.adminRoleGroupCreateListUrl(adminGroupRoleList).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Tạo phân quyền nhóm thành công !");
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
