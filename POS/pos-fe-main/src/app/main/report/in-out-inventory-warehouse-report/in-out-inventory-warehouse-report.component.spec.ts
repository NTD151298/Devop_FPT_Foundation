import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InOutInventoryWarehouseReportComponent } from './in-out-inventory-warehouse-report.component';

describe('InOutInventoryWarehouseReportComponent', () => {
  let component: InOutInventoryWarehouseReportComponent;
  let fixture: ComponentFixture<InOutInventoryWarehouseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InOutInventoryWarehouseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InOutInventoryWarehouseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
