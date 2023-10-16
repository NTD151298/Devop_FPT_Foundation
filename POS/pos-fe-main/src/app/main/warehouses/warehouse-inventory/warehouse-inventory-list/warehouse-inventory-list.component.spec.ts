import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryListComponent } from './warehouse-inventory-list.component';

describe('WarehouseInventoryListComponent', () => {
  let component: WarehouseInventoryListComponent;
  let fixture: ComponentFixture<WarehouseInventoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
