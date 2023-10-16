import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SupplierService } from 'src/services/supplier.service';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css']
})
export class DebtComponent implements OnInit {

  keyword: "";
  supplier_id;
  page_number = 1;
  page_size = 10;
  listSup = [];
  constructor(
    private supplierService: SupplierService,
    private diaLog: ConfirmDialogService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getListSup()
  }

  getListSup() {
    this.supplierService.getSupplierList({
      keyword: this.keyword,
      supplier_id: this.supplier_id,
      page_number: this.page_number,
      page_size: this.page_size
    }).subscribe(rs => {
      this.listSup = rs['data'].lists
      console.log(this.listSup);
      
    })
  }

  deleteSup(id) {
    this.diaLog.confirm('','Bạn thực sự muốn xóa nhà cung cấp này?', 'OK','Hủy')
    .then((confirm) => {
      if(confirm) {
        this.supplierService.deleteSupplier(id).subscribe((rs) => {
          if(rs.statusCode === 200) {
            this.toast.success(rs.message)
            this.getListSup()
          } else {
            this.toast.error(rs.message)
          }
        })
      } 
    })
    .catch(() => {
      throw new Error('Có lỗi xảy ra!')
    })
  }
}
