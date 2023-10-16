import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseExportListComponent } from './warehouse-export-list.component';

describe('WarehouseExportListComponent', () => {
  let component: WarehouseExportListComponent;
  let fixture: ComponentFixture<WarehouseExportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseExportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseExportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
