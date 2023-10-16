import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseRequestListComponent } from './warehouse-request-list.component';

describe('WarehouseRequestListComponent', () => {
  let component: WarehouseRequestListComponent;
  let fixture: ComponentFixture<WarehouseRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
