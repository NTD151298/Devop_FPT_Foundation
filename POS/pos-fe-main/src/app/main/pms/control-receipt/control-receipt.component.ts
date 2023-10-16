import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POSServices } from 'src/services/pos/pos.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-control-receipt',
  templateUrl: './control-receipt.component.html',
  styleUrls: ['./control-receipt.component.css']
})
export class ControlReceiptComponent implements OnInit {

  dataList: any = {
    keyword: '',
    start_date: '',
    end_date: '',
    status_id: ''
  };

  paging: any = {
    page_size: 15,
    page_number: 1,
    totalRow: 2
  };

  listPartner = [];
  dataTableControl = [];

  constructor(
    private router: Router,
    private posService: POSServices,
  ) { }

  ngOnInit(): void {
    this.getListControl(false)
    let token = localStorage
  };

  moveToEditOrCreate() {
    this.router.navigate(['/main/control/control-receipt-edit-create']);
  };

  getListControl(event) {
    console.log(event.value);
    
    if(event && event.value !== null) {
      let fillDataList = this.listPartner?.filter(obj => obj.value === event.value)
      this.dataList.keyword = fillDataList[0].label
    };
    
    if(event.value === null) {
      this.dataList.keyword = '';
    };

    this.posService.Purchase().getList({
      ...this.dataList,
      page_size: this.paging.page_size,
      page_number: this.paging.page_number
    }).subscribe(rs => {
      let data = rs['data'].lists
      this.dataTableControl = data

      if (!event) {
        let fillData = data.map(obj => (
          {
            value: obj.id,
            label: obj.partner_name
          }
        ))
        this.listPartner = fillData;
      } 
    });
  };


}
