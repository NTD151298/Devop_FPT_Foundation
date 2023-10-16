import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { mapArrayForDropDown, validVariable } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _services: POSServices,
    private _toastr: ToastrService
  ) {
  }
  data: any = {};
  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      this.getDetail(!validVariable(params.id) ? 0 : parseInt(params.id));
    })
  }
  getAllOptions() {

  }

  getDetail(id: number) {
    this._services.Order().getDetail(id).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.data = res.data;
      } else {
        this._toastr.error(res.message)
      }
    })
  }

}
