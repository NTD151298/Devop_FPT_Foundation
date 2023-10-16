import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { code_province, symbol_supplier } from 'src/services/common/conts';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { LocationService } from 'src/services/pos/location.service';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import { deepCopy } from 'src/app/shared/globlafunction';

@Component({
  selector: 'app-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.css']
})
export class PartnerDetailComponent implements OnInit {
  id: any;
  item: any = {
    listDetail: []
  };
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();
  formGroupCreate!: FormGroup;
  province: any[] = code_province;
  newItem: any = {};
  listDetai: any[] = [];
  units: any[] = [];
  packings: any[] = [];
  product: any[] = [];

  constructor(
    private _services: POSServices,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
  ) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = parseInt(params.id);
    });
  }

  ngOnInit(): void {
    this.province = mapArrayForDropDown(this.province, 'name', 'code');
    let data = {
      keyword: '',
      category_code: '',
      page_size: 20,
      page_number: 0,
    };
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt()),
      product = lastValueFrom(this._services.Product().getList(data));
    Promise.all([unit, packing, product]).then(
      (res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.packings = mapArrayForDropDown(res[1].data.lists, 'name', 'code');
        this.product = deepCopy(res[2].data.lists);
        this.product.map(obj => {
          obj.label = obj.name;
          obj.value = obj.id;
        });
        console.log(this.product);
        this.initCreateForm();
        this.setFormValue();
      }
    );
  }

  initCreateForm() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      is_delete: false,
      id_ecom: 0,
      code: "",
      name: ["", Validators.required],
      phone: "",
      website: "",
      email: "",
      taxcode: ["", Validators.required],
      introduce: "",
      province_code: [0, Validators.required],
    })
  }

  setFormValue() {
    this._services.Partner().get(this.id).subscribe((rs: any) => {
      if (rs['statusCode'] == 200) {
        this.formGroupCreate.patchValue(rs.data);
        this.load_listDetai();
        this.resetNewItem();
      }
      else {
        this.toast.warning(rs['message']);
      }
    });
  }

  save() {
    this.formGroupCreate.patchValue({
      code: `S1${this.formGroupCreate.value.province_code}${symbol_supplier}`
    });
    if (this.formGroupCreate.invalid) {
      this.toast.warning("Yêu cầu nhập đầy đủ trường bắt buộc & không được nhập trùng");
      return;
    }
    if (this.id == 0)//thêm mới
    {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn tạo mới bản ghi này ?')
        .then((confirmed) => {
          if (confirmed) {
            this._services.Partner().add(this.formGroupCreate.value).subscribe(rs => {
              if (rs['statusCode'] == 200) {
                this.toast.success(rs['message']);
              } else if (rs['statusCode'] == 500) {
                this.toast.warning("Yêu cầu nhập đầy đủ trường bắt buộc & không được nhập trùng");
              }
              else {
                this.toast.warning(rs['message']);
              }
              this.itemSubmited.emit(rs['data']);
            });
          }
        }
        )
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this._services.Partner().edit(this.formGroupCreate.value).subscribe(rs => {
              this.itemSubmited.emit(rs['data']);

              if (rs['statusCode'] == 200) {
                this.toast.success("Cập nhật đối tác thành công !");
              } else {
                this.toast.warning(rs['message']);
              }
            })
          }
        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }

  // bổ sung 

  resetNewItem() {
    this.newItem = {
      "id": 0,
      "is_delete": false,
      "product_id": 0,
      "partner_id": this.formGroupCreate.value.id,
      "price": 0,
      "unit_code": "",
      "packing_code": "",
      "note": "",
      "product_name": "",
      "partner_name": this.formGroupCreate.value.name
    }
  }

  validate_listDetai(item) {
    if (!item?.product_id) {
      this.toast.warning("Thông báo", "Yêu cầu chọn nhà cung cấp")
      return false;
    }
    if (!item?.price) {
      this.toast.warning("Thông báo", "Yêu cầu nhập giá")
      return false;
    }
    if (!item?.unit_code) {
      this.toast.warning("Thông báo", "Yêu cầu chọn đơn vị")
      return false;
    }
    if (!item?.packing_code) {
      this.toast.warning("Thông báo", "Yêu cầu chọn kiểu đóng gói")
      return false;
    }
    return true
  }

  add_listDetai() {
    if (this.validate_listDetai(this.newItem)) {
      this.newItem = {
        ...this.newItem,
        "product_name": this.product.find(obj => obj.value == this.newItem.product_id).label,
        "partner_id": this.formGroupCreate.value.id,
        "partner_name": this.formGroupCreate.value.name
      }
      this._services
        .Partner()
        .add_listDetai(this.newItem)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.resetNewItem();
            this.load_listDetai();
            this.toast.success(res.message);
          } else {
            this.toast.error(res.message);
          }
        });
    }
  }

  edit_listDetai(item) {
    if (this.validate_listDetai(item)) {
      item = {
        ...item,
        "product_name": this.product.find(obj => obj.value == item.product_id).label,
        "partner_id": this.formGroupCreate.value.id,
        "partner_name": this.formGroupCreate.value.name
      }
      this._services
        .Partner()
        .edit_listDetai(item)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            this.load_listDetai();
            this.toast.success(res.message);
          } else {
            this.toast.error(res.message);
          }
        });
    }
  }

  delete_listDetai(item) {
    this.confirmDialog
      .confirm(
        '',
        `Bạn có thực sự muốn xóa bản ghi này ?`,
        'Xác nhận',
        'Huỷ',
        'md'
      )
      .then((confirmed) => {
        if (confirmed) {
          item.is_delete = true;
          this._services
            .Partner()
            .edit_listDetai(item)
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                this.load_listDetai();
                this.toast.success(res.message);
              } else {
                this.toast.error(res.message);
              }
            });
        }
      });
  }

  load_listDetai() {
    this._services
      .Partner()
      .get_listDetai(this.id, "")
      .subscribe(({ data }: any) => {
        this.listDetai = data;
      });
  }

  resetItem(type, index) {
    if (type == 'new') {
      let itemProduct = this.product.find(obj => obj.value == this.newItem.product_id)
      this.newItem = {
        ... this.newItem,
        "price": 0,
        "unit_code": itemProduct.unit_code,
        "packing_code": itemProduct.packing_code,
        "note": "",
        "product_name": itemProduct.label,
      }
    }
    else {
      let itemProduct = this.product.find(obj => obj.value == this.listDetai[index].product_id)
      this.listDetai[index] = {
        ...this.listDetai[index],
        "price": 0,
        "unit_code": itemProduct.unit_code,
        "packing_code": itemProduct.packing_code,
        "note": "",
        "product_name": itemProduct.label,
      }
    }
  }

  cancel() {
    this._location.back();
  }

}
