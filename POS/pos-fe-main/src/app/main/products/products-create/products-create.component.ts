import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, lastValueFrom } from 'rxjs';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';

@Component({
  selector: 'app-products-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent implements OnInit {

  @Input() id: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  item: any = {
    name: '',
    id: 0,
    is_delete: false,
    code: '',
    note: '',
    id_ecom: 0,
    partner_id: 0,
    category_code: '',
    ecom_prartner_id: 0,
    is_active: true,
    barcode: '',
    price: null,
  };
  product_form_dis: boolean = false;
  products: any[] = [];
  partners: any[] = [];
  units: any[] = [];
  packings: any[] = [];
  price_import: number = 0;
  constructor(private _services: POSServices, private _toastr: ToastrService, public modal: NgbActiveModal,) { }

  ngOnInit(): void {
    this.getAllOptions()
  }

  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      product = lastValueFrom(this._services.Category().Product().getOpt()),
      partners = lastValueFrom(this._services.Partner().getOpt());
    Promise.all([unit, packing, product, partners]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.packings = mapArrayForDropDown(res[1].data.lists, 'name', 'code');
        this.products = mapArrayForDropDown(res[2].data.lists, 'name', 'code');
        this.partners = mapArrayForDropDown(res[3].data.lists, 'name', 'id');
        if (this.id != 0) {
          this.getDetail(this.id);
        }
      }
    );
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validate(item) {
    if (!item?.name) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập tên sản phẩm");
      return false;
    }
    if (!item?.partner_id) {
      this._toastr.warning("Thông báo", "Yêu cầu chọn nhà cung cấp");
      return false;
    }
    if (!item?.barcode) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập mã barcode");
      return false;
    }    
    if (!item?.unit_code) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập đơn vị sản phẩm");
      return false;
    }
    if (!item?.packing_code) {
      this._toastr.warning("Thông báo", "Yêu cầu quy cách đóng gói");
      return false;
    }
    if (!this.price_import) {
      this._toastr.warning("Thông báo", "Yêu cầu nhập 'giá nhập'");
      return false;
    }
    return true
  }

  save() {
    if (!this.validate(this.item)) {
      return
    }
    if (this.id == 0) {
      this._services
        .Product()
        .add({ ...this.item, price: this.item.price || 0 })
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.add_listDetai(res.data.id);
            this._toastr.success(res.message);
            this.itemSubmited.emit();
            this.modal.close();
          } else {
            this._toastr.error(res.message);
          }
        });
    }
    // else {
    //   this._services
    //     .Product()
    //     .edit({ ...this.item, price: this.item.price || 0 })
    //     .subscribe((res: any) => {
    //       if (res.statusCode === 200) {
    //         this._toastr.success('Cập nhật thành công');
    //         this.itemSubmited.emit();
    //         this.modal.close();
    //       } else {
    //         this._toastr.error('Cập nhật thất bại');
    //       }
    //     });
    // }
  }

  add_listDetai(id) {   
    let newItem = {
      "id": 0,
      "is_delete": false,
      "product_id": id,
      "partner_id": this.item.partner_id,
      "price": this.price_import,
      "unit_code": this.item.unit_code,
      "packing_code": this.item.packing_code,
      "note": "",
      "product_name": this.item.name,
      "partner_name": this.partners.find(obj => this.item.partner_id == obj.value).label
    }
    this._services
      .Product()
      .add_listDetai(newItem)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          // this._toastr.success(res.message);
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  getDetail(id: string) {
    this._services
      .Product()
      .get(id)
      .subscribe((res: any) => {
        this.item = res.data;
      });
  }

  close(): void {
    this.modal.close();
  }

}
