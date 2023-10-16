import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryDetailComponent } from './warehouse-inventory-detail.component';

describe('WarehouseInventoryDetailComponent', () => {
  let component: WarehouseInventoryDetailComponent;
  let fixture: ComponentFixture<WarehouseInventoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
