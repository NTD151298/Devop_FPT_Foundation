import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { AuthenticationService } from 'src/services/auth/auth.service';
import {
  mapArrayForDropDown,
  validVariable,
} from 'src/services/common/globalfunction';
import { POSServices } from 'src/services/pos/pos.service';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomerPopupCreateComponent } from 'src/app/pos/customer-popup-create/customer-popup-create.component';
import { CustomerModel } from 'src/app/models/pos/customers';
import { UltisService } from 'src/app/shared/services/ultis.service';
@Component({
  selector: 'app-refund-order-detail',
  templateUrl: './refund-order-detail.component.html',
  styleUrls: ['./refund-order-detail.component.css'],
  providers: [DialogService],
})
export class RefundOrderDetailComponent implements OnInit {
  item: any = {
    refund_order: [],
    order: {},
    status_id: 0,
    code: '',
    product_total_cost: 0,
    total_refund_money: 0,
    order_id: 0,
    customer_name: '',
    customer_phone: '',
    sale_cost: 0,
    voucher_cost: 0,
  };
  newProduct: any = {
    id: 0,
  };
  _params: any = {};
  disableForm: boolean = false;
  units: any[] = [];
  filteredCustomers: CustomerModel[] = [];
  filteredOrders: any[] = [];
  listWarehouse: any = [];
  isView: boolean = false;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _services: POSServices,
    private _toastr: ToastrService,
    private _location: Location,
    public dialogService: DialogService,
    private utils: UltisService,
    private _auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      this.item.id = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.isView = this.item.id != 0;
      this.getAllOptions();
    });
  }
  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt());
    let warehouse = lastValueFrom(this._services.Warehouse().getOpt());
    Promise.all([unit, warehouse]).then((res: any) => {
      this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
      this.listWarehouse = this.utils.genWarehouses(res[1].data);
      setTimeout(() => (this.item.warehouse_id = this._auth.currentUserWarehouseId), 200);
      this.item.id !== 0 && this.getDetail();
    });
  }

  getDetail() {
    this._services
      .Refund()
      .getDetail(this.item.id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.item = res.data;
          this.item.sale_cost = this.item.sale_cost || 0;
          this.item.voucher_cost = this.item.voucher_cost || 0;
        } else {
          this._toastr.error(res.message);
        }
      });
  }

  validate() {
    if (this.item.refund_order.length == 0) {
      this._toastr.error('Chưa có đơn hàng hoàn');
      return false;
    } else {
      let check = 0, checkQ = true;
      this.item.refund_order.forEach(element => {
        let pros = element.products.filter(e => e.isCheck && e.quantity_max > 0);
        if (pros && pros.length > 0) {
          check++;
          pros.forEach(el => {
            if (el.quantity == 0) {
              this._toastr
                .error(`Nhập số lượng sản phẩm "${el.name}" lớn hơn 0 `);
              checkQ = false;
            } else
              if (el.quantity > el.quantity_max) {
                this._toastr
                  .error(`Không nhập số lượng sản phẩm "${el.name}" lớn hơn
              ${el.quantity_max} ! do sai số lượng bán !!`);
                checkQ = false;
              }
          });
        }
      });
      if (check == 0) {
        this._toastr.error('Chưa chọn sản phẩn hàng hoàn');
        return false;
      } else {
        return checkQ;
      }
    }
  }

  save() {
    if (!this.validate()) {
      return;
    }
    let model = {
      ...this.item,
      warehouse_id: this.item.warehouse_id || this._auth.currentUserWarehouseId,
      customer_id: this.item.Customer?.id,
      sale_cost: this.item.sale_cost || 0,
      voucher_cost: this.item.voucher_cost || 0,
      refund_order: this.item.refund_order.map((obj: any) => ({
        order_id: obj.id,
        order_code: obj.code,
        total_refund_money: obj.total_refund_money,
        products: obj.products.filter(e => e.isCheck && e.quantity_max > 0),
      })),
    };

    this._services
      .Refund()
    [this.item.id === 0 ? 'add' : 'edit'](model)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          if (res.data.order_id == -1) {
            this._toastr.error(res.message);
          } else
            if (res.data.order_id == 0) {
              this._toastr.error('Có lỗi xảy ra khi tạo đơn hàng âm');
            } else {
              this._toastr.success(res.message);
              this._router.navigate(['main/refund']);
            }

        } else {
          this._toastr.error(res.message);
        }
      });
  }
  getListCustomers(keyword: string, selected: number) {
    this._services
      .GetListCustomers({ keyword: keyword, size: 10, currentPage: 1 })
      .subscribe((res: any) => {
        if (res.data?.lists) {
          this.filteredCustomers = res.data.lists.map((obj: any) => ({
            ...obj,
            nameView: obj.name + ' - ' + obj.phone,
          }));
          if (selected != 0) {
            this.item.Customer = this.filteredCustomers.find(
              (x) => x.id == selected
            );
          }
        }
      });
  }
  getListOrders(keyword: string, selected: number) {
    this._services
      .Refund()
      .getListOrder({
        keyword: keyword,
        warehouse_id: this.item.warehouse_id || this._auth.currentUserWarehouseId,
      })
      .subscribe((res: any) => {
        if (res.data) {
          this.filteredOrders = res.data;
          if (selected != 0) {
            this.item.order = this.filteredOrders.find((x) => x.id == selected);
          }
        }
      });
  }
  showCreateCustomer() {
    const ref = this.dialogService.open(CustomerPopupCreateComponent, {
      header: 'Thêm mới khách hàng',
      width: '60%',
    });
    ref.onClose.subscribe((datas: any) => {
      if (datas) {
        this.getListCustomers(datas.data.phone, datas.data.id);
      }
    });
  }
  filterCustomers(event: any) {
    let query = event.query;
    this.getListCustomers(query, 0);
  }

  filterOrders(event: any) {
    let query = event.query;
    this.getListOrders(query, 0);
  }

  addOrder() {
    if (
      this.item.order &&
      this.item.order.code &&
      this.item.refund_order.filter((e) => e.code == this.item.order?.code)
        .length == 0
    ) {
      this._services
        .Refund()
        .checkOrder(this.item.order)
        .subscribe((res: any) => {
          if (res.data && res.data.data) {
            res.data.data.products = res.data.data.products?.map((obj: any) => ({
              ...obj,
              quantity_max: obj.quantity,
            }));
            this.item.refund_order.push(res.data.data);
          } else if (res.data.code == 3) {
            this._toastr.error('Đơn hàng đã hoàn hết');
          } else if (res.data.code == 4) {
            this._toastr.error('Đơn hàng quá hạn hoàn');
          } else {
            this._toastr.error('Đơn hàng lỗi');
          }
          this.item.order = {};
        });
    } else {
      this._toastr.error('Vui lòng nhập hóa đơn hoàn');
    }
  }

  deleteRefund(refund) {
    refund.delete = true;
    this.item.refund_order = this.item.refund_order.filter((e) => !e.delete);
  }

  selectAllProduct(refund) {
    refund.products = refund.products.map((obj: any) => ({
      ...obj,
      isCheck: refund.isCheckAll ? obj.quantity > 0 : false,
    }));
    this.calculatePrice(refund);
  }

  selectProduct(refund) {
    refund.isCheckAll =
      refund.products.filter((e) => e.isCheck).length == refund.products.length;
    this.calculatePrice(refund);
  }

  calculatePrice(refund) {
    let productCheck = refund.products.filter((item) => item.isCheck);
    refund.total_refund_money = productCheck.reduce(
      (sum, current) => sum + current.price * current.quantity,
      0
    );
    this.item.product_total_cost = 0;
    this.item.total_refund_money = 0;
    this.item.refund_order.forEach(element => {
      let pros = element.products.filter((item) => item.isCheck);
      this.item.product_total_cost += pros.reduce(
        (sum, current) => sum + current.price * current.quantity,
        0
      );
      this.item.total_refund_money += pros.reduce(
        (sum, current) =>
          sum +
          (current.sale_price > 0 ? current.sale_price : current.price) *
          current.quantity,
        0
      );
    });
    this.item.sale_cost = this.item.product_total_cost - this.item.total_refund_money;
  }

  calculateSaleSost() {
    this.item.sale_cost = this.item.product_total_cost - this.item.total_refund_money;
  }
}
