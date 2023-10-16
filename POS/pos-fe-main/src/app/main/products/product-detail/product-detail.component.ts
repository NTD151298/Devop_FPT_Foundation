import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, lastValueFrom } from 'rxjs';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  item: any = {
    name: '',
    id: 0,
    is_delete: false,
    code: '',
    note: '',
    category_code: '',
    is_active: true,
    barcode: '',
  };
  product_form_dis: boolean = true;
  units: any[] = [];
  products: any[] = [];
  packings: any[] = [];
  warehouses: any[] = [];
  id;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _services: POSServices
  ) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params.id;
      if (params.id != '0') {
        this.getMappingDatas(params.id);
      }
    });
  }

  ngOnInit(): void {}

  getMappingDatas(id: string) {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      product = lastValueFrom(this._services.Category().Product().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([unit, product, packing, warehouse]).then((res: any) => {
      this.units = res[0].data.lists;
      this.products = mapArrayForDropDown(res[1].data.lists, 'name', 'code');
      this.packings = res[2].data.lists;
      this.warehouses = res[3].data;
      this.getDetail(id);
    });
  }

  getDetail(id: string) {
    this._services
      .Product()
      .get(id)
      .subscribe((res: any) => {
        res.data.listDetail.forEach((detail) => {
          detail.warehouse_name = this.warehouses.find(
            (ele) => ele.id === detail.warehouse_id
          )?.name;
          detail.unit_name = this.units.find(
            (ele) => ele.code === detail.unit_code
          )?.name;
          detail.packing_name = this.packings.find(
            (ele) => ele.code === detail.packing_code
          )?.name;
          // detail.warehouse_name = this.warehouses.find(ele=>ele.id === detail.warehouse_id)?.name;
        });
        this.item = res.data;
      });
  }
}
