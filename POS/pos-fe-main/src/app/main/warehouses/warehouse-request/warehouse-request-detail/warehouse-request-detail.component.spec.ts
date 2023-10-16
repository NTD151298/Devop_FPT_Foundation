import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseRequestDetailComponent } from './warehouse-request-detail.component';

describe('WarehouseRequestDetailComponent', () => {
  let component: WarehouseRequestDetailComponent;
  let fixture: ComponentFixture<WarehouseRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseRequestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
