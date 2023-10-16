//Q.A Fix
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { LocationService } from 'src/services/pos/location.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';

@Component({
  selector: 'app-modal-create-modify-group-role',
  templateUrl: './modal-create-modify-group-role.component.html',
  styleUrls: ['./modal-create-modify-group-role.component.scss']
})
export class ModalCreateModifyGroupRoleComponent implements OnInit {

  @Input() group;
  @Input() title: string;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  roleList: Array<any>;
  groupRoleList;
  lengthGroupRoleList: any;

  isCreate: boolean = true;
  formSubmitted = false;
  stt: number = 0;
  displayItem = '';

  groupRoleListModify = [];

  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.userService.adminRoleListUrl(),
      this.userService.adminRoleGroupListByGroupIdUrl(this.group.id)
    ]).subscribe(([roleList, groupRoleList]) => {
      this.roleList = roleList.data;
      this.groupRoleList = groupRoleList.data;
      this.lengthGroupRoleList = this.groupRoleList.length;
      this.handleData(this.roleList, this.groupRoleList)
    })
  }

  handleData(roleList, groupRoleList) {
    roleList.forEach((roleListItem, indexRoleListItem) => {
      let findChildren = true;
      roleListItem.checkBox = false;
      roleListItem.highlight = false;
      roleListItem.role_Details.forEach((roleListChild, indexRoleListChild) => {
        roleListChild.checkBox = false;
        for (let i = 0; i < groupRoleList.length; i++) {
          if (roleListChild.checkBox == true) {
            break;
          }
          for (let j = 0; j < groupRoleList[i].details.length; j++) {
            if (groupRoleList[i].details[j].role_detail_id == roleListChild.id) {
              roleListChild.checkBox = true;
              roleListItem.highlight = true;
              break;
            } else {
              if ((i == (groupRoleList.length - 1)) && (j == (groupRoleList[i].details.length - 1))) {
                findChildren = false;
              }
              continue;
            }
          }
        }
      })

      if (findChildren == true && groupRoleList.length > 0) {
        roleListItem.checkBox = true;
        roleListItem.highlight = true;
      }
    })

  }

  showItem(name) {
    if (this.displayItem && this.displayItem == name) {
      this.displayItem = ''
    } else {
      this.displayItem = name;
    }
  }

  stopPropagation(event) {
    event.stopPropagation()
  }

  onCheckAllChange(event, roleListItem) {
    if (event.target.checked) {
      roleListItem.highlight = true;
      roleListItem.role_Details.forEach(obj => {
        obj.checkBox = true;
      })
    } else {
      roleListItem.highlight = false;
      roleListItem.role_Details.forEach(obj => {
        obj.checkBox = false;
      })
    }
  }

  onCheckChange(event, roleListItem) {
    if (event.target.checked) {
      roleListItem.highlight = true;
      for (let i = 0; i < roleListItem.role_Details.length; i++) {
        if (roleListItem.role_Details[i].checkBox == false) {
          roleListItem.checkBox = false;
          break;
        } else {
          if (i == (roleListItem.role_Details.length - 1)) {
            roleListItem.checkBox = true;
            break;
          }
        }
      }
    } else {
      roleListItem.checkBox = false;
      for (let i = 0; i < roleListItem.role_Details.length; i++) {
        if (roleListItem.role_Details[i].checkBox == true) {
          roleListItem.highlight = true;
          break;
        } else {
          if (i == roleListItem.role_Details.length - 1) {
            roleListItem.highlight = false;
          }
          continue;
        }
      }
    }
  }

  save() {
    this.formSubmitted = true;
    this.compareGroupRoleList(this.groupRoleList, this.roleList)
    if (this.groupRoleList[0].id == 0) {
      this.userService.adminRoleGroupCreateListUrl(this.groupRoleList).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success(rs.message);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      })
    } else {
      this.userService.adminRoleGroupModifyListUrl(this.groupRoleList).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success(rs.message);
          this.close()
        } else {
          this.toast.warning(rs.message);
        }
      })
    }
  }

  compareGroupRoleList(groupRoleList, roleList) {
    roleList.forEach(roleListItem => {
      if (roleListItem.checkBox == true) {
        if (this.lengthGroupRoleList > 0) {
          let breakForEach = false;
          let findFather = false;
          groupRoleList.forEach((groupRoleListItem, indexGroupRoleListItem) => {
            // trường hợp có groupRole cha
            if (breakForEach) { return; }

            if (roleListItem.id == groupRoleListItem.role_id) {
              findFather = true;
              breakForEach = true;
              let breakLoop = false;
              for (let i = 0; i < roleListItem.role_Details.length; i++) {
                for (let j = 0; j < groupRoleListItem.details.length; j++) {
                  if (roleListItem.role_Details[i].id == groupRoleListItem.details[j].role_detail_id) {
                    break;
                  } else {
                    if (j == (groupRoleListItem.details.length - 1)) {
                      groupRoleListItem.details.push({
                        id: 0,
                        is_delete: false,
                        role_group_id: this.group.id,
                        role_detail_id: roleListItem.role_Details[i].id,
                      })
                    }
                    continue;
                  }
                }
              }
            }
          })
          if (findFather == false) {
            groupRoleList.push({
              id: 0,
              is_delete: false,
              group_id: this.group.id,
              role_id: roleListItem.id,
              details: []
            })
            roleListItem.role_Details.forEach(roleListItemChild => {
              groupRoleList[groupRoleList.length - 1].details.push({
                id: 0,
                is_delete: false,
                role_group_id: this.group.id,
                role_detail_id: roleListItemChild.id
              })
            })
          }
        } else {
          groupRoleList.push({
            id: 0,
            is_delete: false,
            group_id: this.group.id,
            role_id: roleListItem.id,
            details: []
          })
          roleListItem.role_Details.forEach(roleListItemChild => {
            groupRoleList[groupRoleList.length - 1].details.push({
              id: 0,
              is_delete: false,
              role_group_id: this.group.id,
              role_detail_id: roleListItemChild.id
            })
          })
        }
      } else {
        let checkFather = true;
        roleListItem.role_Details.forEach((roleListItemChild) => {
          if (roleListItemChild.checkBox == true) {
            checkFather = false;
            if (groupRoleList.length > 0) {
              let findChildren = false;
              for (let i = 0; i < groupRoleList.length; i++) {
                if (findChildren) { break; }
                for (let j = 0; j < groupRoleList[i].details.length; j++) {
                  if (roleListItemChild.id == groupRoleList[i].details[j].role_detail_id) {
                    findChildren = true;
                    break;
                  } else {
                    if (j == (groupRoleList[i].details.length - 1) && i == (groupRoleList.length - 1)) {
                      let findFather = false;
                      // tìm thấy groupRole cha
                      groupRoleList.forEach(groupRoleListItem => {
                        if (groupRoleListItem.role_id == roleListItem.id) {
                          findFather = true;
                          groupRoleListItem.details.push({
                            id: 0,
                            is_delete: false,
                            role_group_id: this.group.id,
                            role_detail_id: roleListItemChild.id
                          })
                        }
                      })
                      // không tìm thấy groupRole cha
                      if (findFather == false) {
                        groupRoleList.push({
                          id: 0,
                          is_delete: false,
                          group_id: this.group.id,
                          role_id: roleListItem.id,
                          details: [{
                            id: 0,
                            is_delete: false,
                            role_group_id: this.group.id,
                            role_detail_id: roleListItemChild.id
                          }]
                        })
                        findChildren = true;
                        break;
                      }
                    }
                    continue;
                  }
                }
              }
            } else {
              groupRoleList.push({
                id: 0,
                is_delete: false,
                group_id: this.group.id,
                role_id: roleListItem.id,
                details: [{
                  id: 0,
                  is_delete: false,
                  role_group_id: this.group.id,
                  role_detail_id: roleListItemChild.id
                }]
              })


            }
          } else {
            for (let i = 0; i < groupRoleList.length; i++) {
              for (let j = 0; j < groupRoleList[i].details.length; j++) {
                if (groupRoleList[i].details[j].role_detail_id == roleListItemChild.id) {
                  groupRoleList[i].details[j].is_delete = true;
                }
              }
            }
          }
        })
        if (checkFather == true) {
          for (let i = 0; i < groupRoleList.length; i++) {
            if (groupRoleList[i].role_id == roleListItem.id) {
              groupRoleList[i].is_delete = true;
            }
          }
        }
      }
    })
  }

  close() {
    this.modal.close();
  }

}

// cũ
// import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { forkJoin } from 'rxjs';
// import { formatDate } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';
// import { UserService } from 'src/services/pos/user.service';
// import { LocationService } from 'src/services/pos/location.service';
// import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';

// @Component({
//   selector: 'app-modal-create-modify-group-role',
//   templateUrl: './modal-create-modify-group-role.component.html',
//   styleUrls: ['./modal-create-modify-group-role.component.scss']
// })
// export class ModalCreateModifyGroupRoleComponent implements OnInit {

//   @Input() group;
//   @Input() title: string;
//   @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

//   roleList: Array<any>;
//   groupRoleList;

//   isCreate: boolean = true;
//   formSubmitted = false;
//   stt: number = 0;
//   displayItem = '';

//   groupRoleListModify = [];

//   constructor(
//     private userService: UserService,
//     public modal: NgbActiveModal,
//     private _locationService: LocationService,
//     public fb: FormBuilder,
//     private toast: ToastrService,
//     private confirmDialog: ConfirmDialogService
//   ) { }

//   ngOnInit(): void {
//     forkJoin([
//       this.userService.adminRoleListUrl(),
//       this.userService.adminRoleGroupListByGroupIdUrl(this.group.id)
//     ]).subscribe(([roleList, groupRoleList]) => {
//       this.roleList = roleList.data;
//       this.groupRoleList = groupRoleList.data;
//       this.handleData(this.roleList, this.groupRoleList)
//     })
//   }

//   handleData(roleList, groupRoleList) {
//     roleList.forEach((roleListItem, indexRoleListItem) => {
//       let findChildren = true;
//       roleListItem.checkBox = false;
//       roleListItem.highlight = false;
//       roleListItem.role_Details.forEach((roleListChild, indexRoleListChild) => {
//         roleListChild.checkBox = false;
//         for (let i = 0; i < groupRoleList.length; i++) {
//           if (roleListChild.checkBox == true) {
//             break;
//           }
//           for (let j = 0; j < groupRoleList[i].details.length; j++) {
//             if (groupRoleList[i].details[j].role_detail_id == roleListChild.id) {
//               roleListChild.checkBox = true;
//               roleListItem.highlight = true;
//               break;
//             } else {
//               if ((i == (groupRoleList.length - 1)) && (j == (groupRoleList[i].details.length - 1))) {
//                 findChildren = false;
//               }
//               continue;
//             }
//           }
//         }
//       })

//       if (findChildren == true && groupRoleList.length > 0) {
//         roleListItem.checkBox = true;
//         roleListItem.highlight = true;
//       }
//     })

//   }

//   showItem(name) {
//     if (this.displayItem && this.displayItem == name) {
//       this.displayItem = ''
//     } else {
//       this.displayItem = name;
//     }
//   }

//   stopPropagation(event) {
//     event.stopPropagation()
//   }

//   onCheckAllChange(event, roleListItem) {
//     if (event.target.checked) {
//       roleListItem.highlight = true;
//       roleListItem.role_Details.forEach(obj => {
//         obj.checkBox = true;
//       })
//     } else {
//       roleListItem.highlight = false;
//       roleListItem.role_Details.forEach(obj => {
//         obj.checkBox = false;
//       })
//     }
//   }

//   onCheckChange(event, roleListItem) {
//     if (event.target.checked) {
//       roleListItem.highlight = true;
//       for (let i = 0; i < roleListItem.role_Details.length; i++) {
//         if (roleListItem.role_Details[i].checkBox == false) {
//           roleListItem.checkBox = false;
//           break;
//         } else {
//           if (i == (roleListItem.role_Details.length - 1)) {
//             roleListItem.checkBox = true;
//             break;
//           }
//         }
//       }
//     } else {
//       roleListItem.checkBox = false;
//       for (let i = 0; i < roleListItem.role_Details.length; i++) {
//         if (roleListItem.role_Details[i].checkBox == true) {
//           roleListItem.highlight = true;
//           break;
//         } else {
//           if (i == roleListItem.role_Details.length - 1) {
//             roleListItem.highlight = false;
//           }
//           continue;
//         }
//       }
//     }
//   }

//   save() {
//     this.formSubmitted = true;
//     this.compareGroupRoleList(this.groupRoleList, this.roleList)
//     if (this.groupRoleList[0].id == 0) {
//       this.userService.adminRoleGroupCreateListUrl(this.groupRoleList).subscribe(rs => {
//         if (rs.statusCode == 200) {
//           this.toast.success(rs.message);
//         } else {
//           this.toast.warning(rs.message);
//         }
//         this.close()
//       })
//     } else {
//       this.userService.adminRoleGroupModifyListUrl(this.groupRoleList).subscribe(rs => {
//         if (rs.statusCode == 200) {
//           this.toast.success(rs.message);
//         } else {
//           this.toast.warning(rs.message);
//         }
//         this.close()
//       })
//     }
//   }

//   compareGroupRoleList(groupRoleList, roleList) {
//     roleList.forEach(roleListItem => {
//       if (roleListItem.checkBox == true) {
//         if (groupRoleList.length > 0) {
//           let breakForEach = false;
//           let findFather = false;
//           groupRoleList.forEach((groupRoleListItem, indexGroupRoleListItem) => {
//             // trường hợp có groupRole cha
//             if (breakForEach) { return; }

//             if (roleListItem.id == groupRoleListItem.role_id) {
//               findFather = true;
//               breakForEach = true;
//               let breakLoop = false;
//               for (let i = 0; i < roleListItem.role_Details.length; i++) {
//                 for (let j = 0; j < groupRoleListItem.details.length; j++) {
//                   if (roleListItem.role_Details[i].id == groupRoleListItem.details[j].role_detail_id) {
//                     break;
//                   } else {
//                     if (j == (groupRoleListItem.details.length - 1)) {
//                       groupRoleListItem.details.push({
//                         id: 0,
//                         is_delete: false,
//                         role_group_id: this.group.id,
//                         role_detail_id: roleListItem.role_Details[i].id,
//                       })
//                     }
//                     continue;
//                   }
//                 }
//               }
//             }
//           })
//           if (findFather == false) {
//             groupRoleList.push({
//               id: 0,
//               is_delete: false,
//               group_id: this.group.id,
//               role_id: roleListItem.id,
//               details: []
//             })
//             roleListItem.role_Details.forEach(roleListItemChild => {
//               groupRoleList[groupRoleList.length - 1].details.push({
//                 id: 0,
//                 is_delete: false,
//                 role_group_id: this.group.id,
//                 role_detail_id: roleListItemChild.id
//               })
//             })
//           }
//         } else {
//           groupRoleList.push({
//             id: 0,
//             is_delete: false,
//             group_id: this.group.id,
//             role_id: roleListItem.id,
//             details: []
//           })
//           roleListItem.role_Details.forEach(roleListItemChild => {
//             groupRoleList[groupRoleList.length - 1].details.push({
//               id: 0,
//               is_delete: false,
//               role_group_id: this.group.id,
//               role_detail_id: roleListItemChild.id
//             })
//           })
//         }
//       } else {
//         let checkFather = true;
//         roleListItem.role_Details.forEach((roleListItemChild) => {
//           if (roleListItemChild.checkBox == true) {
//             checkFather = false;
//             if (groupRoleList.length > 0) {
//               let findChildren = false;
//               for (let i = 0; i < groupRoleList.length; i++) {
//                 if (findChildren) { break; }
//                 for (let j = 0; j < groupRoleList[i].details.length; j++) {
//                   if (roleListItemChild.id == groupRoleList[i].details[j].role_detail_id) {
//                     findChildren = true;
//                     break;
//                   } else {
//                     if (j == (groupRoleList[i].details.length - 1)) {
//                       let findFather = false;
//                       // tìm thấy groupRole cha
//                       groupRoleList.forEach(groupRoleListItem => {
//                         if (groupRoleListItem.role_id == roleListItem.id) {
//                           findFather = true;
//                           groupRoleListItem.details.push({
//                             id: 0,
//                             is_delete: false,
//                             role_group_id: this.group.id,
//                             role_detail_id: roleListItemChild.id
//                           })
//                         }
//                       })
//                       // không tìm thấy groupRole cha
//                       if (findFather == false) {
//                         groupRoleList.push({
//                           id: 0,
//                           is_delete: false,
//                           group_id: this.group.id,
//                           role_id: roleListItem.id,
//                           details: [{
//                             id: 0,
//                             is_delete: false,
//                             role_group_id: this.group.id,
//                             role_detail_id: roleListItemChild.id
//                           }]
//                         })
//                       }
//                     }
//                     continue;
//                   }
//                 }
//               }
//             } else {
//               groupRoleList.push({
//                 id: 0,
//                 is_delete: false,
//                 group_id: this.group.id,
//                 role_id: roleListItem.id,
//                 details: [{
//                   id: 0,
//                   is_delete: false,
//                   role_group_id: this.group.id,
//                   role_detail_id: roleListItemChild.id
//                 }]
//               })
//             }
//           } else {
//             for (let i = 0; i < groupRoleList.length; i++) {
//               for (let j = 0; j < groupRoleList[i].details.length; j++) {
//                 if (groupRoleList[i].details[j].role_detail_id == roleListItemChild.id) {
//                   groupRoleList[i].details[j].is_delete = true;
//                 }
//               }
//             }
//           }
//         })
//         if (checkFather == true) {
//           for (let i = 0; i < groupRoleList.length; i++) {
//             if (groupRoleList[i].role_id == roleListItem.id) {
//               groupRoleList[i].is_delete = true;
//             }
//           }
//         }
//       }
//     })
//   }

//   close() {
//     this.modal.close();
//   }

// }
