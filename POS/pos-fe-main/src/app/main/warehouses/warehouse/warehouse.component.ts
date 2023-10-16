import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingConstant, TypeWarehouse } from 'src/app/shared/common/app.constants';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { POSServices } from 'src/services/pos/pos.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocationService } from 'src/services/pos/location.service';
import { ModalCreateModifyWarehouseComponent } from './modal-create-modify-warehouse/modal-create-modify-warehouse.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {

  warehouses;
  virtualWarehouse;
  filterFormCreate: FormGroup;
  typeWarehouse = TypeWarehouse;
  provinces;
  stt: number = 0;
  totalRows: number = 0;

  constructor(
    private warehouseService: POSServices,
    private modalService: NgbModal,
    private confirmDialog: ConfirmDialogService,
    private toast: ToastrService,
    private _locationService: LocationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormCreate()
    this.warehouseList();
  }

  initFormCreate() {
    this.filterFormCreate = this.fb.group({
      type: 99,
      page_size: 15,
      keyword: "",
      page_number: 1
    })
  }

  reset() {
    this.filterFormCreate = this.fb.group({
      type: 99,
      page_size: 15,
      keyword: "",
      page_number: 1
    })
    this.warehouseList();
  }

  search() {
    this.filterFormCreate.value.type  = parseInt(this.filterFormCreate.value.type)
    // this.filterFormCreate.value.keyword  = String(this.filterFormCreate.value.keyword)
    this.warehouseList();
  }


  onChangedPage(event: any): void {
    this.filterFormCreate.value.page_number = event.page;
    this.warehouseList();
  }

  warehouseList() {
    this.warehouseService.Warehouse().getList(this.filterFormCreate.value).subscribe(rs => {
      this.warehouses = rs['data'].lists;
      this.totalRows = rs['data'].totalcount;
      this.stt = this.filterFormCreate.value.page_size * (rs['data'].page - 1);
    })
  }

  modalCreateModifyWarehouse(id) {
    const dialogRef = this.modalService.open(ModalCreateModifyWarehouseComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.itemId = id;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.warehouseList();
      }
    });
  }

  warehouseDelete(warehouse) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          // this.warehouseService.Warehouse().delete(warehouse.id).subscribe(rs => {
          //   if (rs.statusCode == 200) {
          //     this.toast.success("Xóa kho thành công !");
          //     this.warehouseList()
          //   } else {
          //     this.toast.warning(rs.message);
          //   }
          // })
        }
      }
      )
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
