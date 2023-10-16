import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  formGroupCreate: FormGroup;
  page = {
    stt: 0,
    pageSize: 15,
    pageNumber: 1,
    totalItem: 0,
  }
  contractList = [];
  supplierList = [];
  statusList = [];


  constructor(
    private posService: POSServices,
    public _router: Router,
    public fb: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initFormGroupCreate();
    this.getListContract();
  }

  addContract() {
    this._router.navigate([`main/contract/modal-create-contract`])
  }

  viewContract(id) {
    console.log(id);

    this._router.navigate([`main/contract/modal-create-contract/${id}`])
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      keyword: [''],
    })
  }

  search() {
    this.getListContract();
  }

  getListContract() {
    this.posService.Contract().getList({
      ...this.formGroupCreate.value,
      page_size: this.page.pageSize,
      page_number: this.page.pageNumber,
    }).subscribe((rs: any) => {
      console.log(rs)
      this.contractList = rs.data.lists;
      console.log(this.contractList);

      this.page.totalItem = rs['data'].totalcount;
      this.page.pageNumber = rs['data'].page;
      this.page.stt = this.page.pageSize * (rs['data'].page - 1);
    })
  }

  onChangedPage(event: PageChangedEvent): void {
    this.page.pageNumber = event.page + 1;
    this.getListContract();
  }

  delete(id) {
    this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn xóa bản ghi này ?')
      .then((confirmed) => {
        if (confirmed) {
          this.posService.Contract().delete(id).subscribe((rs: any) => {
            if (rs.statusCode === 200) {
              this._toastr.success(rs.message);
              this.getListContract();
            } else {
              this._toastr.error(rs.message)
            }
          })
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
   }
}


