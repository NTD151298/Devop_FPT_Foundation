import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/pos/user.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { LocationService } from 'src/services/pos/location.service';
import { ChangeDetectionStrategy } from '@angular/compiler';

@Component({
  selector: 'app-modal-create-edit',
  templateUrl: './modal-create-edit.component.html',
  styleUrls: ['./modal-create-edit.component.scss']
})
export class ModalCreateEditComponent implements OnInit {

  @Input() user: Array<any> = [];
  @Input() itemDetail: any;
  @Output() itemSubmited: EventEmitter<any> = new EventEmitter();

  formGroupCreate!: FormGroup;
  isCreate: boolean = true;
  confirmPassword = {
    error: null,
    value: null
  };

  provinces: any[] = [];
  selectedProvince: any;
  selectedProvinceTempt: any;
  districts: any[] = [];
  selectedDistrict: any;
  selectedDistrictTempt: any;
  wards: any[] = [];
  selectedWard: any;
  selectedWardTempt: any;

  formSubmitted = false;
  listSex = [{
    id: 0,
    name: 'Nam',
  }, {
    id: 1,
    name: 'Nữ',
  }];

  listStatus = [{
    status: true,
    name: 'Kích hoạt',
  }, {
    status: false,
    name: 'Bị khóa',
  }]

  constructor(
    private userService: UserService,
    public modal: NgbActiveModal,
    private _locationService: LocationService,
    public fb: FormBuilder,
    private toast: ToastrService,
    private confirmDialog: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!!this.itemDetail) {
      this.initModifyForm();
      forkJoin([
        this._locationService.GetProvices(),
        this._locationService.GetDistrictsByProvince(this.itemDetail.province_id),
        this._locationService.GetWatdsByDistrict(this.itemDetail.district_id)
      ])
        .subscribe(([provinces, districts, wards]) => {
          try {
            if (provinces.data.length > 0) {
              this.handleProvineData(provinces);
            }
            if (districts.data.length > 0) {
              this.handleDistrictData(districts);
            }
            if (wards.data.length > 0) {
              this.handleWardData(wards);
            }
          }
          catch (err) {
            console.log("error")
          }
          finally {
            this.setValue(this.itemDetail);
            this.cdr.markForCheck();
          }
        })
    } else {
      this.initCreateForm()
      this.getProvinces()
    }
  }

  initCreateForm() {
    this.formGroupCreate = new FormGroup({
      id: new FormControl(0),
      code: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      pass_code: new FormControl(''),
      email: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      landline_number: new FormControl(''),
      full_name: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      birthday: new FormControl(''),
      province_id: new FormControl(2),
      district_id: new FormControl(2),
      ward_id: new FormControl(2),
      sex: new FormControl(null),
      is_active: new FormControl(true),
      type: new FormControl(0),
    })
  }

  initModifyForm() {
    this.formGroupCreate = this.fb.group({
      id: new FormControl(''),
      code: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      full_name: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      birthday: new FormControl(''),
      province_id: new FormControl(''),
      district_id: new FormControl(''),
      ward_id: new FormControl(''),
      sex: new FormControl(''),
      is_active: new FormControl(''),
      type: new FormControl(''),
    })
  }

  setValue(user: any) {
    this.formGroupCreate?.patchValue(user);
    this.formGroupCreate.get('birthday').setValue(formatDate(this.itemDetail.birthday, 'yyyy-MM-dd', 'en'))
  }

  get lf() {
    return this.formGroupCreate?.controls;
  }

  close(): void {
    this.modal.close();
  }

  getProvinces(): void {
    this._locationService.GetProvices().subscribe(res => {
      this.handleProvineData(res);
    });
  }

  handleProvineData(provinces: any) {
    let data = provinces['data'];
    this.provinces = [];
    this.districts = [];
    this.wards = [];
    data.forEach((element: any) => {
      this.provinces.push({ 'value': element.id, 'label': element.city });
    });
  }

  getDistrictByProvince(data: any): void {
    if (data.target.value) {
      this._locationService.GetDistrictsByProvince(data.target.value).subscribe(res => {
        this.handleDistrictData(res)
      });
    }
  }

  handleDistrictData(districts: any) {
    let data = districts['data'];
    this.districts = [];
    this.wards = [];
    data.forEach((element: any) => {
      this.districts.push({ 'value': element.id, 'label': element.name });
    });
  }

  getWardsByDistrict(data: any): void {
    if (data.target.value) {
      this._locationService.GetWatdsByDistrict(data.target.value).subscribe(res => {
        this.handleWardData(res)
      });
    }
  }

  handleWardData(ward: any) {
    let data = ward['data'];
    this.wards = [];
    data.forEach((element: any) => {
      this.wards.push({ 'value': element.id, 'label': element.name });
    });
  }

  save() {
    this.formSubmitted = true;
    this.confirmPassword.error = null;
    if (this.confirmPassword.value != this.formGroupCreate.value.password) {
      this.confirmPassword.error = true;
      return;
    }
    if (this.formGroupCreate.invalid) {
      return;
    }
    this.formGroupCreate.value.province_id = parseInt(this.formGroupCreate.value.province_id)
    this.formGroupCreate.value.district_id = parseInt(this.formGroupCreate.value.district_id)
    this.formGroupCreate.value.ward_id = parseInt(this.formGroupCreate.value.ward_id)
    if (!this.itemDetail) {
      this.userService.createUser(this.formGroupCreate.value).subscribe(rs => {

        if (rs.statusCode == 200) {
          this.toast.success("Thêm mới user thành công !");
        } else {
          this.toast.warning(rs.message);
        }
        this.close()
      })
    } else {
      this.confirmDialog.confirm('Please confirm..', 'Bạn có thực sự muốn sửa bản ghi này')
        .then((confirmed) => {
          if (confirmed) {
            this.userService.modifyUser(this.formGroupCreate.value).subscribe(rs => {
              this.itemSubmited.emit(rs.data);

              if (rs.statusCode == 200) {
                this.toast.success("Cập nhật user thành công !");
              } else {
                this.toast.warning(rs.message);
              }
              this.close()
            })
          }
        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }
}
