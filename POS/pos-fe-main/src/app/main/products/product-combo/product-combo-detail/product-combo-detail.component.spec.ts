import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboDetailComponent } from './product-combo-detail.component';

describe('ProductComboDetailComponent', () => {
  let component: ProductComboDetailComponent;
  let fixture: ComponentFixture<ProductComboDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComboDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
