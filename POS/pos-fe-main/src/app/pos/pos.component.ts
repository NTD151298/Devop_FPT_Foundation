import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { POSServices } from 'src/services/pos/pos.service';
import { CustomerPopupCreateComponent } from './customer-popup-create/customer-popup-create.component';
import { CustomerModel } from '../models/pos/customers';
import { ProductViewModel } from '../models/pos/product';
import { CloseSaleSessionComponent } from './close-sale-session/close-sale-session.component';
import { validVariable } from 'src/services/common/globalfunction';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { list_payment_type } from 'src/services/common/conts';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
  providers: [DialogService],
})
export class PosComponent implements OnInit {
  model: any;
  modelInvoid: any;
  selectedProduct: any;
  activeBankAccount: boolean = true;
  activeBtnPayment: boolean = true;
  enableConfirm: boolean = true;
  filteredProducts: any[] = [];
  filteredCustomers: CustomerModel[] = [];
  productsSelected: any[] = [];
  vouchers: any[] = [];
  banks: any[] = [];
  idSession: any;
  cashReceiver: number = 0;
  cashReturn: number = 0;
  activeVoucherPrice: boolean = false;
  warehouseId: number = 0;
  warehouse: any = {};

  constructor(
    private _activatedRoute: ActivatedRoute,
    private pOSServices: POSServices,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _router: Router,
    private titleService: Title,
    private auth: AuthenticationService,
    private _toastr: ToastrService
  ) {
    if (!this.auth.currentUserWarehouseId || this.auth.currentUserWarehouseId === 0) {
      this._toastr.error('Lỗi kho bạn liên hệ quản trị viên');
      this._router.navigate(['main/order-list']);
    }
  }

  ngOnInit(): void {
    this.setDefaultForm();
    this.getListBankAccount();
    this.titleService.setTitle(`Đơn hàng smartgap`);
    this._activatedRoute.params.subscribe((params: any) => {
      this.idSession = !validVariable(params.id) ? 0 : parseInt(params.id);
      this.warehouseId = !validVariable(params.wh) ? this.auth.currentUserWarehouseId : parseInt(params.wh);
      if (!this.warehouseId || this.warehouseId === 0) {
        this._toastr.error('Lỗi kho bạn liên hệ quản trị viên');
        this._router.navigate(['main/order-list']);
      }
      this.getCheckSessionId(this.idSession);
      this.getWarehouse();
    });
  }

  getWarehouse() {
    this.pOSServices.Warehouse().get(this.warehouseId).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.warehouse = res.data;
      } else {
        this._toastr.error(res.message);
      }
    })
  }

  keyPressSearchProduct(event: any) {
    let val = event.target.value;
    if (event.keyCode == 13) {
      var modelCode = this.getCodeProductByBarcode(val);
      if (modelCode.isScale) {
        this.getProductBarcode(modelCode);
      } else if (modelCode.quantityScale > 0) {
        this.getProductBarcode(modelCode);
      }
    }
  }

  getListProduct(keyword: any) {
    this.pOSServices
      .GetListProduct({
        keyword: keyword,
        size: 10,
        currentPage: 1,
        warehouse_id: this.warehouseId,
      })
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.filteredProducts = res.data.lists.map((obj: any) => ({
            ...obj,
            nameView: obj.name + ' - ' + obj.barcode,
          }));
        } else {
          //this._toastr.error(res.message);
        }
      });
  }

  getProductBarcode(model: any) {
    this.pOSServices
      .GetProductBarcode({
        keyword: model.code,
        warehouse_id: this.warehouseId,
      })
      .subscribe((res: any) => {
        if (res.data) {
          res.data.nameView = res.data.name + ' - ' + res.data.barcode;
          res.data.quantity = model.quantityScale;
          res.data.isScale = model.isScale;
          this.addProduct(res.data);
          this.model.Product = null;
        }
      });
  }

  getListCustomers(keyword: string, selected: number) {
    this.pOSServices
      .GetListCustomers({ keyword: keyword, size: 10, currentPage: 1 })
      .subscribe((res: any) => {
        if (res.data?.lists) {
          this.filteredCustomers = res.data.lists.map((obj: any) => ({
            ...obj,
            nameView: obj.name + ' - ' + obj.phone,
          }));
          if (selected != 0) {
            this.model.Customer = this.filteredCustomers.find(
              (x) => x.id == selected
            );
            this.validateFormPos();
          }
        }
      });
  }

  getListVouchers(event: any) {
    let modelVoucher = {
      status: 1,
      code: event.query,
      start_date: null,
      end_date: null,
      page_number: 0,
      page_size: 0,
    };
    this.pOSServices.GetListVouchers(modelVoucher).subscribe((res: any) => {
      this.vouchers = res.data.lists.map((obj: any) => ({
        ...obj,
        nameView: obj.code + ' - ' + obj.name,
      }));
    });
  }

  getListBankAccount() {
    this.pOSServices.GetListBankAccount().subscribe((res: any) => {
      this.banks = res.data;
    });
  }

  onSelectVoucher() {
    // tính giảm giá
    this.onChangeQuantity();
    this.activeVoucherPrice = true;
  }
  onClearVoucher() {
    // tính giảm giá
    this.model.isChangeDiscount = false;
    this.model.Discount = 0;
    this.model.Voucher = null;
    this.onChangeQuantity();
    this.activeVoucherPrice = false;
  }

  changeDiscount() {
    this.model.isChangeDiscount = true;
    this.onChangeQuantity();
  }
  changeCashReceiver() {
    this.onChangeQuantity();
  }
  getCodeProductByBarcode(val: string) {
    if (val && val.startsWith('1') && val.length == 13) {
      return {
        isScale: true,
        quantityScale: parseInt(val.slice(7, 12)) / 1000,
        code: val.slice(1, 7),
      };
    }
    if (val.length == 12 && val.startsWith('0')) {
      return {
        isScale: false,
        quantityScale: 1,
        code: val.slice(1, val.length),
      };
    }
    return {
      isScale: false,
      quantityScale: 1,
      code: val,
    };
  }

  onChangePayment() {
    this.activeBankAccount = this.model.TypePayment == 'cash';
    this.onChangeQuantity();
  }

  searchProducts() {
    this.getListProduct(this.model.Product ? this.model.Product : '');
  }

  filterProducts(event: any) {
    let query = event.query;
    var modelCode = this.getCodeProductByBarcode(query);
    if (!modelCode.isScale || modelCode.quantityScale == 1) {
      this.getListProduct(query);
    }
  }

  onSelectProduct() {
    var product = this.filteredProducts.find(
      (x) => x.id == this.model.Product?.id
    );
    if (product) {
      product.quantity = 1;
      this.addProduct(product);
    }
    this.validateFormPos();
  }

  deleteRow(id: number): void {
    this.productsSelected = this.productsSelected.filter((d) => d.index !== id);
    this.onChangeQuantity();
  }

  onChangeQuantity() {
    let totalsale = 0;
    let total = 0;
    this.productsSelected.forEach((e, i) => {
      let q = e.quantity ? e.quantity : 0;
      totalsale += q * (e.sale_price > 0 ? e.sale_price : e.price);
      total += q * e.price;
      e.index = i;
    });
    this.model.ProductTotal = totalsale;
    this.model.ProductTotalBase = total;
    //tính giảm giá
    if (this.model.Voucher) {
      let dateend = new Date(this.model.Voucher.end_date);
      let datestart = new Date(this.model.Voucher.active_date);
      let today = new Date();
      if (dateend > today && datestart < today) {
        if (this.model.isChangeDiscount) {
          //todo
        } else
          if (this.model.Voucher.type == 0) {
            let discount =
              (this.model.ProductTotal * this.model.Voucher.reduction_rate) / 100;
            let max = this.model.Voucher.maximum_reduction;
            this.model.Discount = discount >= max ? max : discount;
          } else if (this.model.Voucher.reduction_price > 0) {
            this.model.Discount = this.model.Voucher.reduction_price;
          }
      }
    }
    this.model.TotalAmount = this.model.ProductTotal - this.model.Discount;
    this.model.TotalAmount =
      this.model.TotalAmount < 0 ? 0 : this.model.TotalAmount;
    this.cashReturn = this.cashReceiver - this.model.TotalAmount;
    if (this.model.TypePayment != 'cash') {
      this.cashReturn = 0;
    }
    this.validateFormPos();
  }

  addProduct(product: any) {
    let check = this.productsSelected.filter(
      (d) => d.barcode == product.barcode && !d.isScale
    );
    if (check && check.length > 0) {
      this.productsSelected.forEach((element) => {
        if (element.barcode == product.barcode && !element.isScale) {
          element.quantity++;
        }
      });
    } else {
      this.productsSelected = [
        {
          ...product,
          quantity:
            product.quantity && product.quantity == 0 ? 1 : product.quantity,
          isScale: product.isScale,
        },
        ...this.productsSelected,
      ];
    }

    this.onChangeQuantity();
    this.model.Product = null;
  }

  filterCustomers(event: any) {
    let query = event.query;
    this.getListCustomers(query, 0);
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
  onSelectCustomer() {
    let title = this.model.Customer.name
      ? this.model.Customer.name
      : 'Đơn hàng smartgap';
    this.titleService.setTitle(title);
  }

  onAddPaymentClick() {
    window.open(this._router.url, '_blank');
  }
  onAhomeClick() {
    window.open('/main/product-warehouse', '_self');
  }

  confirmPayment() {
    this.confirmationService.confirm({
      message: 'Bạn có muốn thanh toán đơn hàng',
      header: 'Xác nhận thanh toán',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      rejectButtonStyleClass: 'p-button-danger',
      defaultFocus: 'accept',
      accept: () => {
        this.createOrder();
      },
    });
  }

  printInvoid() {
    window.print();
  }

  createOrder() {
    if (this.validateFormPos()) {
      this.model.Customer =
        this.model.Customer instanceof Object
          ? this.model.Customer
          : { id: 0, name: '', phone: '' };      
      let model: any = {
        code: `${this.warehouse.code}.`,
        pos_id: 0,
        warehouse_id: 0, //todo
        sales_session_id: this.idSession,
        customer_id: this.model.Customer.id,
        customer_name: this.model.Customer.name,
        customer_phone: this.model.Customer.phone,
        voucher_id: this.model.Voucher?.id,
        voucher_cost: this.model.Discount ? this.model.Discount : 0,
        sale_cost: this.model.ProductTotalBase - this.model.ProductTotal,
        product_total_cost: this.model.ProductTotalBase,
        status_id: 0,
        bank_account:
          this.model.TypePayment == 'cash'
            ? ''
            : this.model.NumberBank?.account_number,
        payment_type:
          this.model.TypePayment == 'cash' ? 0 : this.model.TypePayment == 'pos' ? 1 : 2,
        transaction_code:
          this.model.TypePayment == 'cash' ? '' : this.model.TranCode,
        total_amount: this.model.TotalAmount,
        note: this.model.Note,
        order_lines: [],
      };
      this.productsSelected.forEach((element) => {
        model.order_lines.push({
          name: element.name,
          product_id: element.product_id,
          unit_code: element.unit_code,
          packing_code: element.packing_code,
          warehouse_id: element.warehouse_id,
          price: element.price,
          sale_price: element.sale_price,
          quantity: element.quantity,
          product_batch_number: '',
          barcode: element.barcode,
          product_warehouse_id: element.id,
          childs: element?.childs || [],
        });
        model.warehouse_id = element.warehouse_id;
      });
      console.log(model);
      this.pOSServices.CreateOrder(model).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thanh toán',
            detail: 'Thanh toán thành công',
          });
          this.activeBtnPayment = false;
          this.modelInvoid = {
            ...model,
            cashReceiver: this.cashReceiver,
            cashReturn: this.cashReturn,
            code: res.data.code,
            address: this.warehouse.address,
            payment_type_name: list_payment_type.find(obj => obj.id == model.payment_type).name_vn,
          };
          console.log(this.modelInvoid)
          setTimeout(() => {
            window.print();
          }, 500);
        } else if (res.statusCode === 400) {
          this._toastr.error('Phiên làm việc đã kết thúc');
          this._router.navigate(['main/order-list']);
        }
        else {
          this._toastr.error(res.message)
        }
      });
    }
  }

  validateFormPos() {
    this.enableConfirm =
      this.productsSelected.length == 0 ||
      //!this.model.Customer ||
      this.model.TotalAmount < 0; //|| this.cashReturn < 0
    return !this.enableConfirm;
  }
  backOrder() {
    this.onCloseClick();
  }

  onCloseClick() {
    const ref = this.dialogService.open(CloseSaleSessionComponent, {
      width: '40%',
      data: this.idSession,
    });
    ref.onClose.subscribe((datas: any) => {
      if (datas) {
        this._router.navigate(['main/order-list']);
      }
    });
  }

  getCheckSessionId(id) {
    this.pOSServices
      .SaleSession()
      .getInfo(id)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          if (!res.data || res.data.id == 0) {
            this._toastr.error('Phiên làm việc đã kết thúc');
            this._router.navigate(['main/order-list']);
          } else if (this.idSession != res.data.id) {
            this._router.navigate([`/pos/${this.warehouseId}/${res.data.id}`]);
          }
        } else {
          this._toastr.error(res.message);
          this._router.navigate(['main/order-list']);
        }
      });
  }

  setDefaultForm() {
    this.model = {
      Product: '',
      TypePayment: 'cash',
      NumberBank: '',
      Note: '',
      Customer: '',
      TotalAmount: 0,
      ProductTotal: 0,
      ProductTotalBase: 0,
      Discount: null,
      Voucher: null,
    };
    this.activeBankAccount = true;
    this.activeBtnPayment = true;
    this.enableConfirm = true;
    this.filteredProducts = [];
    this.filteredCustomers = [];
    this.productsSelected = [];
    this.vouchers = [];
    this.cashReturn = 0;
    this.cashReceiver = null;
  }
}
