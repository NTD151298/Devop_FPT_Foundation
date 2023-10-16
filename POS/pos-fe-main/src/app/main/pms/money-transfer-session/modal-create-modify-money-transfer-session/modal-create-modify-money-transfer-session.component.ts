import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-create-modify-money-transfer-session',
  templateUrl: './modal-create-modify-money-transfer-session.component.html',
  styleUrls: ['./modal-create-modify-money-transfer-session.component.css']
})
export class ModalCreateModifyMoneyTransferSessionComponent implements OnInit {
  form: FormGroup;
  isCheckAll:boolean=false

  listSuppliers = [];
  ListItems = []
  constructor(
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  checkAllUnits(){

  }

  save(){
    
  }

  close(): void {
    this.modal.close();
  }

}
