import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseExportDetailComponent } from './warehouse-export-detail.component';

describe('WarehouseExportDetailComponent', () => {
  let component: WarehouseExportDetailComponent;
  let fixture: ComponentFixture<WarehouseExportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseExportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseExportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
