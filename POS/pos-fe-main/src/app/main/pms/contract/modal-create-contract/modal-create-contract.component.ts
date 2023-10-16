import { Component, OnInit } from '@angular/core';
import { forkJoin, map, pluck, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';
import { SupplierService } from 'src/services/supplier.service';
import { typeContract, termsOfPayment, contractRule } from 'src/app/shared/common/app.constants';
import { mapArrayForDropDown } from 'src/services/common/globalfunction';
import { formatDate, Location } from '@angular/common';
@Component({
  selector: 'app-modal-create-contract',
  templateUrl: './modal-create-contract.component.html',
  styleUrls: ['./modal-create-contract.component.css']
})
export class ModalCreateContractComponent implements OnInit {
  formGroupCreate: FormGroup;
  id;
  typeContractList;
  termOfPaymentList;
  contractRuleList;

  disableForm = false;
  supplierList = [];
  supplierListBackUp = [];
  products = []
  productSelect = []
  contractDetail;

  constructor(
    public _router: Router,
    public fb: FormBuilder,
    private toast: ToastrService,
    public _services: POSServices,
    private _supplier: SupplierService,
    private route: ActivatedRoute,
    private _location: Location,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(pluck('id')).subscribe(id => {
      this.id = id;
    })
    this.typeContractList = mapArrayForDropDown(typeContract, 'name', 'id');
    this.termOfPaymentList = mapArrayForDropDown(termsOfPayment, 'name', 'id');
    this.contractRuleList = mapArrayForDropDown(contractRule, 'name', 'id');
    this.initFormGroupCreate();
    if (this.id) {
      forkJoin([
        this._services.Contract().get(this.id),
        this._supplier.getSupplierList({ keyword: '', page_size: 1, page_number: 0 }),
      ]).pipe(
        map((res: any) => {
          this.contractDetail = res[0].data;
          this.supplierList = mapArrayForDropDown(res[1].data.lists, 'name', 'id');
          console.log(this.supplierList);
          
          this.supplierListBackUp = JSON.parse(JSON.stringify(res[1].data.lists))
          return res[0].data.supplier_id;
        }),
        switchMap((supplier_id) => {
          return this._services.Product().getList({ keyword: '', supplier_id: supplier_id, page_size: 10, page_number: 0 })
        }),
      ).subscribe((res: any) => {
        this.products = mapArrayForDropDown(res.data.lists, 'name', 'id');
        console.log(this.contractDetail)
        this.setFormValue(this.contractDetail);
      })
    } else {
      this.getListSupplier();
    }
  }

  updateProductInfor(event, index) {
    let fillProduct = this.products.filter(obj => obj.id === event.value)
    this.listProductArray.at(index).get('barcode').setValue(fillProduct[0].barcode);
    this.listProductArray.at(index).get('price').setValue(fillProduct[0].price);
    console.log(fillProduct[0]);
  }

  updateSupplierInfor(event) {
    // console.log(this.supplierListBackUp)
    this.supplierListBackUp.map(obj => {
      if (obj.id == event.value) {
        console.log(obj)
        this.formGroupCreate.patchValue({
          partner_taxcode: obj.taxcode,
          partner_phone: obj.phone,
          partner_name: obj.name,
          partner_address: obj.address,
          partner_code: obj.code,
        })
        this.getProductBySupplier(obj.id)
      }
    })
  }

  getProductBySupplier(partner_id) {
    this._services.Product().getList({ keyword: '', partner_id: partner_id, page_size: 10, page_number: 0 }).subscribe((res: any) => {
      this.products = res.data.lists
      this.productSelect = mapArrayForDropDown(res.data.lists, 'name', 'id');
      console.log(this.products);
    })
    
  }

  getListSupplier() {
    this._supplier.getSupplierList({
      keyword: '',
      page_size: 20,
      page_number: 0
    }).subscribe(({ data }: any) => {
      this.supplierList = mapArrayForDropDown(data.lists, 'name', 'id');
      this.supplierListBackUp = JSON.parse(JSON.stringify(data.lists))
      console.log(data)
    })
  }

  getContract(id) {
    this._services.Contract().get(id).subscribe(rs => {
      console.log(rs);
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  initFormGroupCreate() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      name: '',
      partner_code: [''],
      partner_taxcode: [''],
      partner_phone: [''],
      partner_name: [''],
      partner_address: [''],
      contract_product_id: 0,
      type: 0,
      partner_id: 0,
      is_delete: false,
      listProduct: this.fb.array([]),
      contractRule: this.fb.array([]),
      termsOfPayment: this.fb.array([]),
    });
    if (!this.id) {
      this.addProduct();
      this.addContractRule();
      this.addTermsOfPayment();
    }
  }

  setFormValue(data) {
    // console.log(data)
    this.formGroupCreate.patchValue(data);
    this.setListProductValue(data.listProduct);
    this.setContractRuleValue(data.contractRule);
    this.setTermOfPaymentValue(data.termsOfPayment)
  }

  setListProductValue(listProduct) {
    const controls = this.listProductArray;
    listProduct.forEach(item => {
      controls.push(
        this.fb.group({
          ...item
        })
      )
    });
  }

  setContractRuleValue(contractRule) {
    const controls = this.contractRule;
    contractRule.forEach(item => {
      controls.push(
        this.fb.group({
          ...item
        })
      )
    });
  }

  setTermOfPaymentValue(termsOfPayment) {
    const controls = this.termsOfPayment;
    console.log(termsOfPayment)
    termsOfPayment.forEach(item => {
      controls.push(
        this.fb.group({
          ...item
        })
      )
    });
  }

  get listProductArray(): FormArray {
    return this.formGroupCreate.get('listProduct') as FormArray;
  }

  get contractRule(): FormArray {
    return this.formGroupCreate.get('contractRule') as FormArray;
  }

  get termsOfPayment(): FormArray {
    return this.formGroupCreate.get('termsOfPayment') as FormArray;
  }

  addProduct() {
    this.listProductArray.push(this.fb.group({
      id: 0,
      is_delete: false,
      product_id: 0,
      product_name: '',
      partner_name: [''],
      partner_code: [''],
      partner_id: 0,
      contract_id: 0,
      index: 0,
      barcode: [''],
      contract_code: [''],
      price: 0,
      quantity: 0,
      packing_category_code: '',
      unit_category_code: ''
    }))
  }

  removeProduct(index: number) {
    if (this.id) {
      if (this.listProductArray.value[index].id != 0) {
        this.listProductArray.value[index].is_delete = true;
        let data = this.listProductArray.value[index];
        this.listProductArray.removeAt(index);
        this.setListProductValue([data])
      } else {
        this.listProductArray.removeAt(index);
      }
    } else {
      this.listProductArray.removeAt(index);
    }
  }

  addContractRule() {
    this.contractRule.push(this.fb.group({
      id: 0,
      is_delete: false,
      contract_id: 0,
      name: [''],
      type: 0,
      description: ['']
    }))
  }

  removeContractRule(index: number) {
    if (this.id) {
      if (this.contractRule.value[index].id != 0) {
        this.contractRule.value[index].is_delete = true;
        let data = this.contractRule.value[index];
        this.contractRule.removeAt(index);
        this.setContractRuleValue([data])
      } else {
        this.contractRule.removeAt(index);
      }
    } else {
      this.contractRule.removeAt(index);
    }
  }

  addTermsOfPayment() {
    this.termsOfPayment.push(this.fb.group({
      id: 0,
      is_delete: false,
      contract_id: 0,
      name: [''],
      type: 0,
      description: ['']
    }))
  }

  removeTermsOfPayment(index: number) {
    if (this.id) {
      if (this.termsOfPayment.value[index].id != 0) {
        this.termsOfPayment.value[index].is_delete = true;
        let data = this.termsOfPayment.value[index];
        this.termsOfPayment.removeAt(index);
        this.setTermOfPaymentValue([data])
      } else {
        this.termsOfPayment.removeAt(index);
      }
    } else {
      this.termsOfPayment.removeAt(index);
    }
  }

  exit() {
    this._location.back();
  }

  save() {
    if (this.formGroupCreate.invalid) {
      return;
    }
    console.log(this.formGroupCreate.value)
    if (!this.id) {
      this._services.Contract().add(this.formGroupCreate.value).subscribe((rs: any) => {
        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới hợp đồng thành công !");
          this._location.back();
        } else {
          this.toast.warning(rs.message);
        }
      })
    } else {
      this._services.Contract().edit(this.formGroupCreate.value).subscribe((rs: any) => {
        if (rs.statusCode == 200) {
          this.toast.success("Chỉnh sửa hợp đồng thành công !");
          this._location.back();
        } else {
          this.toast.warning(rs.message);
        }
      })
    }
  }
}
