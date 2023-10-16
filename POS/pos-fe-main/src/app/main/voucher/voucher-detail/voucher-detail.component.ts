import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.css']
})
export class VoucherDetailComponent implements OnInit {
  item: any = {
    id: 0,
    type: 0,
    code: '',
    name: ''
  };
  id: any;
  disableForm: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private _services: POSServices, private _toastr: ToastrService, private _location: Location) {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.id !== '0') {
        this.id = params.id;
        this.disableForm = true;
        this.getMappingDatas(params.id);
      }
    })
  }

  ngOnInit(): void {
  }

  getMappingDatas(id: string) {
    this.getDetail(id);
  }

  getDetail(id: string) {
    this._services.Voucher().get(id).subscribe((res: any) => {
      this.item = res.data;
      this.item.end_date = new Date(this.item.end_date);
      this.item.active_date = new Date(this.item.active_date);
    })
  }

  save() {
    this._services.Voucher()[this.item.id === 0 ? 'add' : 'edit'](this.item).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this._toastr.success(res.message);
        this._location.back();
      } else {
        this._toastr.error(res.message)
      }
    })

  }
}
