import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateEditUserWarehouseComponent } from './modal-create-edit-user-warehouse.component';

describe('ModalCreateEditUserWarehouseComponent', () => {
  let component: ModalCreateEditUserWarehouseComponent;
  let fixture: ComponentFixture<ModalCreateEditUserWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateEditUserWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditUserWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
