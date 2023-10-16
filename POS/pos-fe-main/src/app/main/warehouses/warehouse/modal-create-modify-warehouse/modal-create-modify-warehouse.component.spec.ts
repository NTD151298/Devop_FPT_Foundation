import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateModifyWarehouseComponent } from './modal-create-modify-warehouse.component';

describe('ModalCreateModifyWarehouseComponent', () => {
  let component: ModalCreateModifyWarehouseComponent;
  let fixture: ComponentFixture<ModalCreateModifyWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateModifyWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateModifyWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
