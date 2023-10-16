import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserService } from 'src/services/pos/user.service';
import { ModalCreateEditGroupRoleComponent } from '../modal-create-edit-group-role/modal-create-edit-group-role.component';
import { ModalCreateEditRoleComponent } from './modal-create-edit-role/modal-create-edit-role.component';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  stt: number = 0;
  roleList
  constructor(
    private userService: UserService,
    private storeService: StorageService,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.getListRole()
  }

  getListRole():void{
    this.userService.adminRoleListUrl().subscribe(rs => {
      this.roleList = rs.data;
    })
  }

  openCreateEditRoleModal(item, index) {
    const dialogRef = this.modalService.open(ModalCreateEditRoleComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.role = this.roleList;
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.getListRole();
      }
    });
  }

  openCreateModifyGroupRoleModal(item, index) {
    const dialogRef = this.modalService.open(ModalCreateEditGroupRoleComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.role = item || null;
    dialogRef.componentInstance.title = 'Chỉnh sửa nhóm của phân quyền' || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.getListRole();
      }
    });
  }


  deleteRole(role) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.userService.adminRoleDeleteUrl(role.id).subscribe(rs => {
            this.getListRole();
          })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
