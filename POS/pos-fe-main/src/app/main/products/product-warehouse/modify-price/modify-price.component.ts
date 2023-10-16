import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { POSServices } from 'src/services/pos/pos.service';
import { UserService } from 'src/services/pos/user.service';
import { LocationService } from 'src/services/pos/location.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { PagingConstant } from 'src/app/shared/common/app.constants';
import { validVariable, mapArrayForDropDown } from 'src/services/common/globalfunction';
import { debounce, debounceTime, lastValueFrom, map, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-modify-price',
  templateUrl: './modify-price.component.html',
  styleUrls: ['./modify-price.component.css']
})
export class ModifyPriceComponent implements OnInit {

  @Input() itemDetail;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate: FormGroup;
  formSubmitted = false;
  units = [];
  packings = [];
  constructor(
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private posService: POSServices,
    private userService: UserService,
    private _services: POSServices,
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.getAllOptions()
  }

  getAllOptions() {
    let unit = lastValueFrom(this._services.Category().Unit().getOpt()),
      packing = lastValueFrom(this._services.Category().Packing().getOpt());
      Promise.all([unit, packing]).then((res: any) => {
        this.units = mapArrayForDropDown(res[0].data.lists, 'name', 'code');
        this.packings = mapArrayForDropDown(res[1].data.lists, 'name', 'code');
        this.setFormValue(this.itemDetail)
      })
  }


  initFormGroup() {
    this.formGroupCreate = this.fb.group({
      id: 0,
      is_delete: true,
      code: "",
      barcode: "",
      product_id: 0,
      quantity_sold: 0,
      quantity_stock: 0,
      import_price: 0,
      price: 0,
      sale_price: 0,
      unit_code: "",
      barcode_int: 0,
      packing_code: "",
      exp_date: null,
      warning_date: 0,
      warehouse_id: 0,
      batch_number: "",
      is_weigh: false,
    })
  }

  setFormValue(item) {
    this.formGroupCreate.patchValue(item);
  }

  save() {
    this.formSubmitted = true;
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.posService.Product().product_warehouse_modify(this.formGroupCreate.value).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toast.success(res.message);
      } else {
        this.toast.error(res.message)
      }
      this.itemSubmited.emit(res.data);
      this.close()
    })
  }

  close() {
    this.modal.close();
  }


}
