import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReceiptListComponent } from './warehouse-receipt-list.component';

describe('WarehouseReceiptListComponent', () => {
  let component: WarehouseReceiptListComponent;
  let fixture: ComponentFixture<WarehouseReceiptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseReceiptListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
