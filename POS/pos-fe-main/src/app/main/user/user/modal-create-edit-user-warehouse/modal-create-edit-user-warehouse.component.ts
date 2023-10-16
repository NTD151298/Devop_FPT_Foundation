import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';
import { UserService } from 'src/services/pos/user.service';
import { LocationService } from 'src/services/pos/location.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';

@Component({
  selector: 'app-modal-create-edit-user-warehouse',
  templateUrl: './modal-create-edit-user-warehouse.component.html',
  styleUrls: ['./modal-create-edit-user-warehouse.component.css']
})
export class ModalCreateEditUserWarehouseComponent implements OnInit {

  @Input() user;
  @Input() title;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  warehouseList;
  userWarehouseList;
  selectedGroupId;
  formGroupCreate: FormGroup;
  isCreate: boolean = true;
  formSubmitted = false;
  stt: number = 0;
  loading = true;
  constructor(
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private posService: POSServices,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.posService.Warehouse().getList({ keyword: "", page_size: 10, page_number: 0, type: 1 }),
      this.userService.adminUserWarehouseListUrl(this.user.id)
    ]).subscribe(([warehouseList, userWarehouseList]) => {
      this.warehouseList = this.genChildParentWarehouse(warehouseList['data'].lists);
      this.userWarehouseList = userWarehouseList.data;
      this.handleData(this.warehouseList, this.userWarehouseList)
      this.initFormGroupCreate()
      this.setValueFormGroupCreate(this.userWarehouseList)
      this.loading = false;
    })
  }

  handleData(warehouseList, userWarehouseList) {
    for (let j = 0; j < warehouseList.length; j++) {
      this.warehouseList[j].checkbox = false;
      for (let i = 0; i < userWarehouseList.length; i++) {
        if (warehouseList[j].id == userWarehouseList[i].warehouse_id) {
          this.warehouseList[j].checkbox = true;
          break;
        } else {
          if (i == userWarehouseList.length - 1) {
            this.warehouseList[j].checkbox = false;
            break;
          }
          continue
        }
      }
    }
  }

  genChildParentWarehouse(data:any[]){
    let list = data.filter((e) => e.parent_id == 0);
    list.forEach((e) => {
      let child = data.filter((x) => x.parent_id == e.id);
      e.items = child ? child : [];
    });
    return list;
  }


  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      data: this.fb.array([])
    })
  }

  setValueFormGroupCreate(userWarehouseList) {
    userWarehouseList.forEach(obj => {
      this.dataArray.push(this.fb.group({
        id: obj.id,
        is_delete: obj.is_delete,
        user_id: obj.user_id,
        warehouse_id: obj.warehouse_id,
      }))
    })
  }

  get dataArray() {
    return <FormArray>this.formGroupCreate.get('data');
  }

  onCheckChange(event) {
    const formArray = this.dataArray;
    let done = false;
    if (event.target.checked) {
      this.dataArray?.controls.forEach((ctrl: any) => {
        if (ctrl.value.warehouse_id == parseInt(event.target.value)) {
          ctrl.value.is_delete = false;
          done = true;
          return;
        }
      });
      if (done == false) {
        this.dataArray.push(this.fb.group({
          id: 0,
          is_delete: false,
          user_id: this.user.id,
          warehouse_id: parseInt(event.target.value),
        }))
      }
    }
    else {
      let i: number = 0;
      this.dataArray?.controls.forEach((ctrl: any, index) => {
        if (ctrl.value.warehouse_id == event.target.value) {
          if (ctrl.value.id != 0) {
            ctrl.value.is_delete = true
          } else {
            formArray.removeAt(i);
          }
          return;
        }
        i++;
      });
    }
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    if (!(this.userWarehouseList.length > 0)) {
      this.userService.adminUserWarehouseCreateUrl(this.formGroupCreate.value.data).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Tạo kho người dùng thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.userService.adminUserWarehouseModifyUrl(this.formGroupCreate.value.data).subscribe(rs => {
        if (rs.statusCode == 200) {
          this.toast.success("Cập nhật kho người dùng thành công !");
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
