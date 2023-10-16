import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailWarehouseListComponent } from './product-detail-warehouse-list.component';

describe('ProductDetailWarehouseListComponent', () => {
  let component: ProductDetailWarehouseListComponent;
  let fixture: ComponentFixture<ProductDetailWarehouseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailWarehouseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailWarehouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
