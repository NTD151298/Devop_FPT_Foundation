import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateModifyMoneyTransferSessionComponent } from './modal-create-modify-money-transfer-session/modal-create-modify-money-transfer-session.component';


@Component({
  selector: 'app-money-transfer-session',
  templateUrl: './money-transfer-session.component.html',
  styleUrls: ['./money-transfer-session.component.css']
})
export class MoneyTransferSessionComponent implements OnInit {
  formGroupCreate: FormGroup;
  page = {
    stt: 0,
    pageSize: 15,
    pageNumber: 1,
    totalItem: 0,
  }

  listSupplier = [
    {
      supplier_name: 'Công ty cổ phần Linh Chi'
    }
  ];

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  getList(){
    
  }

  moveToDetail() {
    this.router.navigate(['/main/money-transfer-session/modal-purchase-detail'])
  }

  addAndEdit(item, index) {
    const dialogRef = this.modalService.open(ModalCreateModifyMoneyTransferSessionComponent,
      {
        size: 'lg',
      });
    dialogRef.componentInstance.category = {};
    dialogRef.componentInstance.itemDetail = item || null;
    dialogRef.componentInstance.itemSubmited.subscribe((res) => {
      if (res) {
        this.getList();
      }
    });
  }

}
