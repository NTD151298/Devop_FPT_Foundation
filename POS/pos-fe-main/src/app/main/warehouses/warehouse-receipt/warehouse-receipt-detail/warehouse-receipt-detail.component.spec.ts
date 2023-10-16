import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReceiptDetailComponent } from './warehouse-receipt-detail.component';

describe('WarehouseReceiptDetailComponent', () => {
  let component: WarehouseReceiptDetailComponent;
  let fixture: ComponentFixture<WarehouseReceiptDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseReceiptDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReceiptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
